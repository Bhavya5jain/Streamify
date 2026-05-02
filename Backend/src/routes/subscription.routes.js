import express from "express";
const router = express.Router();
import { toggleSubscription, getAllSubscriptions, getSubscriptionStatus, getChannelSubscribers } from "../controllers/subscription.controller.js"
import { authMiddleware } from "../middlewares/Auth.middleware.js";

router.use(authMiddleware)

// Toggle subscribe/unsubscribe
router.post("/toggle/:channelId", toggleSubscription);
// Get all subscriptions of logged-in user
router.get("/", getAllSubscriptions);
// Check if subscribed to a channel
router.get("/:channelId/status", getSubscriptionStatus);
// Get all subscribers of a channel
router.get("/channel/:channelId", getChannelSubscribers);

export default router