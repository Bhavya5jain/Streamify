import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// POST /likes/video/:videoId  →  toggle like on a video
// ─────────────────────────────────────────────
const toogleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new apiError(404, "Video not found");

    // Check if already liked
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        // Unlike
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200, "Video unliked", { liked: false }));
    }

    // Like
    await Like.create({ video: videoId, likedBy: req.user._id });
    return res.status(201).json(new apiResponse(201, "Video liked", { liked: true }));
});

// ─────────────────────────────────────────────
// POST /likes/comment/:commentId  →  toggle like on a comment
// ─────────────────────────────────────────────
const toogleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new apiError(404, "Comment not found");

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200, "Comment unliked", { liked: false }));
    }

    await Like.create({ comment: commentId, likedBy: req.user._id });
    return res.status(201).json(new apiResponse(201, "Comment liked", { liked: true }));
});

// ─────────────────────────────────────────────
// POST /likes/tweet/:tweetId  →  toggle like on a tweet
// ─────────────────────────────────────────────
const toogleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new apiError(404, "Tweet not found");

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200, "Tweet unliked", { liked: false }));
    }

    await Like.create({ tweet: tweetId, likedBy: req.user._id });
    return res.status(201).json(new apiResponse(201, "Tweet liked", { liked: true }));
});

// ─────────────────────────────────────────────
// GET /likes/video/:videoId  →  get total likes on a video
// ─────────────────────────────────────────────
const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const likeCount = await Like.countDocuments({ video: videoId });
    const isLiked = !!(await Like.findOne({ video: videoId, likedBy: req.user._id }));

    return res.status(200).json(
        new apiResponse(200, "Video likes fetched", { likeCount, isLiked })
    );
});

// ─────────────────────────────────────────────
// GET /likes/comment/:commentId  →  get total likes on a comment
// ─────────────────────────────────────────────
const getCommentLikes = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const likeCount = await Like.countDocuments({ comment: commentId });
    const isLiked = !!(await Like.findOne({ comment: commentId, likedBy: req.user._id }));

    return res.status(200).json(
        new apiResponse(200, "Comment likes fetched", { likeCount, isLiked })
    );
});

// ─────────────────────────────────────────────
// GET /likes/tweet/:tweetId  →  get total likes on a tweet
// ─────────────────────────────────────────────
const getTweetLikes = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }

    const likeCount = await Like.countDocuments({ tweet: tweetId });
    const isLiked = !!(await Like.findOne({ tweet: tweetId, likedBy: req.user._id }));

    return res.status(200).json(
        new apiResponse(200, "Tweet likes fetched", { likeCount, isLiked })
    );
});

export { toogleVideoLike, toogleCommentLike, toogleTweetLike, getVideoLikes, getCommentLikes, getTweetLikes };