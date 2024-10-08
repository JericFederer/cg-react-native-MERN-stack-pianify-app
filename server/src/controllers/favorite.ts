import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";

import { PopulateFavList } from "#/@types/audio";
import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/models/audio";
import Favorite from "#/models/favorites";

export const toggleFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "added" | "removed";

  if (!isValidObjectId(audioId)) {
    return res.status(422).json({
      error: "Audio ID is invalid."
    });
  }

  const audio = await Audio.findById(audioId);

  if (!audioId) {
    return res.status(404).json({
      error: "Resources not found."
    });
  }

  // * Check if audio is already in favorites
  const audioInFavorites = await Favorite.findOne({
    owner: req.user.id,
    items: audioId
  })

  console.log("audioInFavorites", audioInFavorites)

  if (audioInFavorites) {
    // * Remove audio from favorites list
    await Favorite.updateOne(
      { owner: req.user.id },
      { $pull: { items: audioId } },
    )

    status = "removed";
  } else {
    const favorites = await Favorite.findOne({ owner: req.user.id });

    if (favorites) {
      // * Add audio to favorites list
      await Favorite.updateOne(
        { owner: req.user.id },
        { $addToSet: { items: audioId } },
      )
    } else {
      // * Create a new favorites list
      await Favorite.create({
        owner: req.user.id,
        items: [audioId]
      })
    }

    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id }
    });
  }

  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user.id }
    });
  }

  res.json({ status });
}

export const getFavorites: RequestHandler = async (req, res) => {
  const userID = req.user.id;
  const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

  const favorites = await Favorite.aggregate([
    { $match: { owner: userID } },
    {
      $project: {
        audioIds: {
          $slice: [
            "$items",
            parseInt(limit) * parseInt(pageNo),
            parseInt(limit),
          ],
        },
      },
    },
    { $unwind: "$audioIds" },
    {
      $lookup: {
        from: "audios",
        localField: "audioIds",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    { $unwind: "$audioInfo" },
    {
      $lookup: {
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about: "$audioInfo.about",
        category: "$audioInfo.category",
        file: "$audioInfo.file.url",
        poster: "$audioInfo.poster.url",
        owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
      },
    },
  ]);

  res.json({ audios: favorites });
};

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;

  if (!isValidObjectId(audioId)) {
    return res.status(422).json({
      error: "Audio ID is invalid."
    });
  }

  const favorite = await Favorite.findOne({
    owner: req.user.id,
    items: audioId,
  });

  res.json({ result: favorite ? true : false });
}