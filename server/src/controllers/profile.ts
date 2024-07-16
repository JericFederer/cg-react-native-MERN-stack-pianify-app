import { RequestHandler } from "express";
import { isValidObjectId, ObjectId, PipelineStage } from "mongoose";
import moment from "moment";

import { getUsersPreviousHistory } from "#/utils/helper";
import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/models/audio";
import User from "#/models/user";
import Playlist from "#/models/playlist";
import History from "#/models/history";
import AutoGeneratedPlaylist from "#/models/autoGeneratedPlaylist";

export const updateFollower: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  let status: "added" | "removed";

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ error: "Invalid profile id." });
  }

  const profile = await User.findById(profileId);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found." });
  }

  const alreadyAFollower = await User.findOne({
    _id: profileId,
    followers: req.user.id,
  });

  if (alreadyAFollower) {
    // * Unfollow the user
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $pull: { followers: req.user.id },
      }
    );

    status = "removed";
  } else {
    // * Follow the user
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $addToSet: { followers: req.user.id },
      }
    );

    status = "added";
  }

  if (status === "added") {
    // * Add to following list
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { followings: profileId } }
    );
  }

  if (status === "removed") {
    // * Remove from following list
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { followings: profileId } }
    );
  }

  res.json({ status });
};

export const getUploads: RequestHandler = async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: req.user.name, id: req.user.id },
    };
  });

  res.json({ audios });
};

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;
  const { profileId } = req.params;

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ error: "Invalid profile id." });
  }

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate<AudioDocument<{ name: string; _id: ObjectId }>>("owner");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({ audios });
};

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params;

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ error: "Invalid profile id." });
  }

  const user = await User.findById(profileId);

  if (!user) {
    return res.status(422).json({ error: "User not found." });
  }

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      followers: user.followers.length,
      avatar: user.avatar?.url,
    },
  });
};

export const getPublicPlaylist: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  if (!isValidObjectId(profileId)) {
    return res.status(422).json({ error: "Invalid profile id." });
  }

  const playlist = await Playlist.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  if (!playlist) {
    return res.json({ playlist: [] });
  }

  res.json({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};

export const getRecommendedByProfile: RequestHandler = async (req, res) => {
  const user = req.user;

  let matchOptions: PipelineStage.Match = {
    $match: { _id: { $exists: true } },
  };

  if (user) {
    const category = await getUsersPreviousHistory(req);

    if (category.length) {
      matchOptions = { $match: { category: { $in: category } } };
    }
  }

  const audios = await Audio.aggregate([
    { $match: { _id: { $exists: true } } },
    { $sort: { "likes.count": -1 } },
    { $limit: 10 },
    { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
    { $unwind: "$owner" },
    { 
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        category: "$category",
        about: "$about",
        file: "$file.url",
        poster: "$poster.url"
      }
    }
  ])

  res.json({ audios });
};

export const getAutoGeneratedPlaylist: RequestHandler = async (req, res) => {
  // find out 5 playlist
  // 1 mix 20

  const [result] = await History.aggregate([
    { $match: { owner: req.user.id } },
    { $unwind: "$all" },
    { $group: { _id: "$all.audio", items: { $addToSet: "$all.audio" } } },
    { $sample: { size: 20 } },
    { $group: { _id: null, items: { $push: "$_id" } } },
  ]);

  const title = "Mix 20";

  if (result) {
    await Playlist.updateOne(
      { owner: req.user.id, title },
      { $set: { title, items: result.items, visibility: "auto" } },
      { upsert: true }
    );
  }

  // 4 autoGeneratedPlaylist
  const category = await getUsersPreviousHistory(req);
  let matchOptions: PipelineStage.Match = {
    $match: { _id: { $exists: true } },
  };

  if (category.length) {
    matchOptions = { $match: { title: { $in: category } } };
  }

  const agpl = await AutoGeneratedPlaylist.aggregate([
    matchOptions,
    { $sample: { size: 4 } },
    {
      $project: {
        _id: 0,
        id: "$_id",
        title: "$title",
        itemsCount: { $size: "$items" },
      },
    },
  ]);

  const playlist = await Playlist.findOne({ owner: req.user.id, title });

  const finalList = agpl.concat({
    id: playlist?._id,
    title: playlist?.title,
    itemsCount: playlist?.items.length,
  });

  res.json({ playlist: finalList });
};

export const getFollowersProfile: RequestHandler = async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  const [result] = await User.aggregate([
    { $match: { _id: req.user.id } },
    {
      $project: {
        followers: {
          $slice: [
            "$followers",
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$followers" },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $group: {
        _id: null,
        followers: {
          $push: {
            id: "$userInfo._id",
            name: "$userInfo.name",
            avatar: "$userInfo.avatar.url",
          },
        },
      },
    },
  ]);

  if (!result) {
    return res.json({ followers: [] });
  }

  res.json({ followers: result.followers });
};

export const getFollowingsProfile: RequestHandler = async (req, res) => {
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  const [result] = await User.aggregate([
    { $match: { _id: req.user.id } },
    {
      $project: {
        followings: {
          $slice: [
            "$followings",
            parseInt(pageNo) * parseInt(limit),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$followings" },
    {
      $lookup: {
        from: "users",
        localField: "followings",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $group: {
        _id: null,
        followings: {
          $push: {
            id: "$userInfo._id",
            name: "$userInfo.name",
            avatar: "$userInfo.avatar.url",
          },
        },
      },
    },
  ]);

  if (!result) {
    return res.json({ followings: [] });
  }

  res.json({ followings: result.followings });
};