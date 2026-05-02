import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// POST /tweets  →  create a tweet
// ─────────────────────────────────────────────
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new apiError(400, "Tweet content is required");
    }
    if (content.length > 280) {
        throw new apiError(400, "Tweet cannot exceed 280 characters");
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id,
    });

    return res.status(201).json(new apiResponse(201, "Tweet created", tweet));
});

// ─────────────────────────────────────────────
// GET /tweets  →  get all tweets (paginated, latest first)
// ─────────────────────────────────────────────
const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const tweets = await Tweet.find()
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .populate("owner", "fullName username avtar");

    const total = await Tweet.countDocuments();

    return res.status(200).json(
        new apiResponse(200, "Tweets fetched", {
            tweets,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        })
    );
});

// ─────────────────────────────────────────────
// GET /tweets/:tweetId  →  get a single tweet
// ─────────────────────────────────────────────
const getTweetById = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId).populate("owner", "fullName username avtar");
    if (!tweet) throw new apiError(404, "Tweet not found");

    return res.status(200).json(new apiResponse(200, "Tweet fetched", tweet));
});

// ─────────────────────────────────────────────
// PUT /tweets/:tweetId  →  update a tweet
// ─────────────────────────────────────────────
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }
    if (!content?.trim()) {
        throw new apiError(400, "Tweet content is required");
    }
    if (content.length > 280) {
        throw new apiError(400, "Tweet cannot exceed 280 characters");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new apiError(404, "Tweet not found");

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only edit your own tweets");
    }

    tweet.content = content.trim();
    await tweet.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, "Tweet updated", tweet));
});

// ─────────────────────────────────────────────
// DELETE /tweets/:tweetId  →  delete a tweet
// ─────────────────────────────────────────────
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new apiError(404, "Tweet not found");

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You can only delete your own tweets");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(new apiResponse(200, "Tweet deleted", {}));
});

export { createTweet, getAllTweets, getTweetById, updateTweet, deleteTweet };