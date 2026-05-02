import express from "express";
import {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    tooglePublishVideo,
} from "../controllers/video.controller.js";
import { authMiddleware } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// All video routes require authentication
router.use(authMiddleware);

// GET  /videos        — list/search videos (paginated)
// POST /videos        — publish a new video (videoFile + thumbnail)
router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishVideo
    );

// GET    /videos/:videoId  — fetch single video (increments views)
// PUT    /videos/:videoId  — update title/description/thumbnail
// DELETE /videos/:videoId  — delete video + Cloudinary assets
router
    .route("/:videoId")
    .get(getVideoById)
    .put(
        upload.fields([{ name: "thumbnail", maxCount: 1 }]),
        updateVideo
    )
    .delete(deleteVideo);

// POST /videos/:videoId/toggle-publish
router.route("/:videoId/toggle-publish").post(tooglePublishVideo);

export default router;