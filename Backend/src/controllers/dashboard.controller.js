import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// GET /dashboard/stats  →  creator dashboard stats
// Returns total videos, views, subscribers, likes, and recent videos
// ─────────────────────────────────────────────
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Total videos by this user
    const totalVideos = await Video.countDocuments({ owner: userId });

    // Total views across all videos
    const viewsAgg = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = viewsAgg[0]?.totalViews || 0;

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    // Total likes on all videos by this user
    const videoIds = await Video.find({ owner: userId }).distinct("_id");
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    // Recent 5 videos
    const recentVideos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title thumbnail views isPublished createdAt duration");

    return res.status(200).json(
        new apiResponse(200, "Channel stats fetched", {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes,
            recentVideos,
        })
    );
});

// ─────────────────────────────────────────────
// GET /dashboard/videos  →  all videos by the logged-in creator
// ─────────────────────────────────────────────
const getChannelVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("title thumbnail views isPublished createdAt duration discription");

    const total = await Video.countDocuments({ owner: userId });

    return res.status(200).json(
        new apiResponse(200, "Channel videos fetched", {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
            videos,
        })
    );
});

export { getChannelStats, getChannelVideos };
