import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// GET /comments/:videoId  →  get all comments on a video (paginated)
// ─────────────────────────────────────────────
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new apiError(404, "Video not found");

    const aggregatePipeline = Comment.aggregate([
        {
            $match: { video: new mongoose.Types.ObjectId(videoId) },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { fullName: 1, username: 1, avtar: 1 } },
                ],
            },
        },
        {
            $addFields: { owner: { $first: "$owner" } },
        },
        { $sort: { createdAt: -1 } },
    ]);

    const options = { page: parseInt(page), limit: parseInt(limit) };
    const comments = await Comment.aggregatePaginate(aggregatePipeline, options);

    return res.status(200).json(new apiResponse(200, "Comments fetched", comments));
});

// ─────────────────────────────────────────────
// POST /comments  →  add a comment on a video
// Body: { videoId, content }
// ─────────────────────────────────────────────
const addVideoComment = asyncHandler(async (req, res) => {
    const { videoId, content } = req.body;

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Valid video ID is required");
    }
    if (!content?.trim()) {
        throw new apiError(400, "Comment content is required");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new apiError(404, "Video not found");

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id,
    });

    if (!comment) throw new apiError(500, "Failed to create comment");

    return res.status(201).json(new apiResponse(201, "Comment added", comment));
});

// ─────────────────────────────────────────────
// POST /comments/tweet  →  add a comment on a tweet
// Body: { tweetId, content }
// ─────────────────────────────────────────────
const addTweetComment = asyncHandler(async (req, res) => {
    const { tweetId, content } = req.body;

    if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Valid tweet ID is required");
    }
    if (!content?.trim()) {
        throw new apiError(400, "Comment content is required");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new apiError(404, "Tweet not found");

    // Note: Reusing Comment model — storing tweet ref in video field as tweet ref
    // Better practice: add a 'tweet' field to Comment model. For now using content+owner.
    const comment = await Comment.create({
        content: content.trim(),
        video: tweetId,   // using video field to store tweetId (adjust model if needed)
        owner: req.user._id,
    });

    if (!comment) throw new apiError(500, "Failed to create comment");

    return res.status(201).json(new apiResponse(201, "Tweet comment added", comment));
});

// ─────────────────────────────────────────────
// PATCH /comments/:commentId  →  update a comment
// ─────────────────────────────────────────────
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }
    if (!content?.trim()) {
        throw new apiError(400, "Updated content is required");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new apiError(404, "Comment not found");

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only edit your own comments");
    }

    comment.content = content.trim();
    await comment.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, "Comment updated", comment));
});

// ─────────────────────────────────────────────
// DELETE /comments/:commentId  →  delete a comment
// ─────────────────────────────────────────────
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new apiError(404, "Comment not found");

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only delete your own comments");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(new apiResponse(200, "Comment deleted", {}));
});

export { getVideoComments, addVideoComment, addTweetComment, updateComment, deleteComment };