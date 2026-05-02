import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscriptions.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// POST /subscriptions/toggle/:channelId  →  subscribe/unsubscribe toggle
// ─────────────────────────────────────────────
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel ID");
    }

    if (channelId === req.user._id.toString()) {
        throw new apiError(400, "You cannot subscribe to your own channel");
    }

    const channel = await User.findById(channelId);
    if (!channel) throw new apiError(404, "Channel not found");

    const existing = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId,
    });

    if (existing) {
        await Subscription.findByIdAndDelete(existing._id);
        return res.status(200).json(
            new apiResponse(200, "Unsubscribed successfully", { subscribed: false })
        );
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId,
    });

    return res.status(201).json(
        new apiResponse(201, "Subscribed successfully", { subscribed: true })
    );
});

// ─────────────────────────────────────────────
// GET /subscriptions  →  get all channels the logged-in user subscribed to
// ─────────────────────────────────────────────
const getAllSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ subscriber: req.user._id })
        .populate("channel", "fullName username avtar coverImage")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, "Subscriptions fetched", {
            total: subscriptions.length,
            subscriptions,
        })
    );
});

// ─────────────────────────────────────────────
// GET /subscriptions/:channelId/status  →  check if subscribed to a channel
// ─────────────────────────────────────────────
const getSubscriptionStatus = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel ID");
    }

    const existing = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId,
    });

    return res.status(200).json(
        new apiResponse(200, "Subscription status fetched", { subscribed: !!existing })
    );
});

// ─────────────────────────────────────────────
// GET /subscriptions/channel/:channelId  →  get all subscribers of a channel
// ─────────────────────────────────────────────
const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new apiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "fullName username avtar")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, "Subscribers fetched", {
            total: subscribers.length,
            subscribers,
        })
    );
});

export { toggleSubscription, getAllSubscriptions, getSubscriptionStatus, getChannelSubscribers };