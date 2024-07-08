import { RequestHandler } from "express";

import { CreatePlaylistRequest, PopulateFavList, UpdatePlaylistRequest } from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { isValidObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res
) => {
  const { title, audioId, visibility } = req.body;
  const ownerId = req.user.id;

  if (audioId) {
    const audio = await Audio.findById(audioId);

    if (!audio) {
      return res.status(404).json({ error: "Could not find the audio." });
    }
  }

  const newPlaylist = new Playlist({
    title,
    owner: ownerId,
    visibility,
  });

  if (audioId) {
    newPlaylist.items = [audioId as any];
  }

  await newPlaylist.save();

  res.status(201).json({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: UpdatePlaylistRequest,
  res
) => {
  const { id, item, title, visibility } = req.body;

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    { title, visibility },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found." });
  }

  if (item) {
    const audio = await Audio.findById(item);

    if (!audio) {
      return res.status(404).json({ error: "Audio not found." });
    }

    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: item },
    });
  }

  res.status(201).json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (req, res) => {
  const { playlistId, audioId, all } = req.query;

  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ error: "Invalid playlist ID." });
  }

  if (all === "yes") {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found." });
    }
  }

  if (audioId) {
    if (!isValidObjectId(audioId)) {
      return res.status(422).json({ error: "Invalid audio ID." });
    }

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user.id,
      },
      {
        $pull: { items: audioId },
      }
    );

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found." });
    }
  }

  res.json({ success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const data = await Playlist.find({
    owner: req.user.id,
    // * Playlists with visibility of "auto" won't be included
    visibility: { $ne: "auto" },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const playlist = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.json({ playlist });
};

export const getAudios: RequestHandler = async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    return res.status(422).json({ error: "Invalid playlist id!" });
  }

  const playlist = await Playlist.findOne({
    owner: req.user.id,
    _id: playlistId,
  }).populate<{ items: PopulateFavList[] }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playlist) {
    return res.json({ list: [] });
  }

  const audios = playlist.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({
    list: {
      id: playlist._id,
      title: playlist.title,
      audios,
    },
  });
};