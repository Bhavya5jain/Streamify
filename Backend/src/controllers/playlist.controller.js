import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// POST /playlists  →  create a playlist
// ─────────────────────────────────────────────
const createPlayList = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name?.trim()) throw new apiError(400, "Playlist name is required");
    if (!description?.trim()) throw new apiError(400, "Playlist description is required");

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        owner: req.user._id,
        videos: [],
    });

    return res.status(201).json(new apiResponse(201, "Playlist created", playlist));
});

// ─────────────────────────────────────────────
// GET /playlists  →  get all playlists of logged-in user
// ─────────────────────────────────────────────
const getAllPlayLists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ owner: req.user._id })
        .populate("videos", "title thumbnail duration views")
        .sort({ createdAt: -1 });

    return res.status(200).json(new apiResponse(200, "Playlists fetched", playlists));
});

// ─────────────────────────────────────────────
// GET /playlists/:playListId  →  get a playlist by ID
// ─────────────────────────────────────────────
const getPlayListById = asyncHandler(async (req, res) => {
    const { playListId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playListId)) {
        throw new apiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playListId)
        .populate({
            path: "videos",
            select: "title thumbnail duration views owner",
            populate: { path: "owner", select: "fullName username avtar" },
        })
        .populate("owner", "fullName username avtar");

    if (!playlist) throw new apiError(404, "Playlist not found");

    return res.status(200).json(new apiResponse(200, "Playlist fetched", playlist));
});

// ─────────────────────────────────────────────
// POST /playlists/:playListId/videos  →  add a video to a playlist
// Body: { videoId }
// ─────────────────────────────────────────────
const addVideosToPlayList = asyncHandler(async (req, res) => {
    const { playListId } = req.params;
    const { videoId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playListId)) throw new apiError(400, "Invalid playlist ID");
    if (!mongoose.Types.ObjectId.isValid(videoId)) throw new apiError(400, "Invalid video ID");

    const playlist = await Playlist.findById(playListId);
    if (!playlist) throw new apiError(404, "Playlist not found");

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only modify your own playlists");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new apiError(404, "Video not found");

    // Avoid duplicates
    if (playlist.videos.includes(videoId)) {
        throw new apiError(400, "Video already exists in this playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, "Video added to playlist", playlist));
});

// ─────────────────────────────────────────────
// DELETE /playlists/:playListId/videos/:videoId  →  remove a video from playlist
// ─────────────────────────────────────────────
const removeVideosFromPlayList = asyncHandler(async (req, res) => {
    const { playListId, videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playListId)) throw new apiError(400, "Invalid playlist ID");
    if (!mongoose.Types.ObjectId.isValid(videoId)) throw new apiError(400, "Invalid video ID");

    const playlist = await Playlist.findById(playListId);
    if (!playlist) throw new apiError(404, "Playlist not found");

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only modify your own playlists");
    }

    playlist.videos = playlist.videos.filter((v) => v.toString() !== videoId);
    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, "Video removed from playlist", playlist));
});

// ─────────────────────────────────────────────
// DELETE /playlists/:playListId  →  delete a playlist
// ─────────────────────────────────────────────
const deletePlayList = asyncHandler(async (req, res) => {
    const { playListId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playListId)) {
        throw new apiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playListId);
    if (!playlist) throw new apiError(404, "Playlist not found");

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only delete your own playlists");
    }

    await Playlist.findByIdAndDelete(playListId);

    return res.status(200).json(new apiResponse(200, "Playlist deleted", {}));
});

export { createPlayList, getAllPlayLists, getPlayListById, addVideosToPlayList, removeVideosFromPlayList, deletePlayList };