import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// GET /dashboard/stats  — creator analytics
router.get("/stats", getChannelStats);

// GET /dashboard/videos — all creator's videos (paginated)
router.get("/videos", getChannelVideos);

export default router;
