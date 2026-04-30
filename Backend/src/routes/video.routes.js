import express from "express";
import {getAllVideos,publishVideo,updateVideo,deleteVideo,tooglePublishVideo} from "../controllers/video.controller.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.use(authMiddleware)

router.get("/",getAllVideos);
router.post("/",upload.fields([{video_File:"video_File"}]),publishVideo);
router.put("/:videoId",updateVideo);
router.delete("/:videoId",deleteVideo);
router.post("/:videoId/toggle-publish",tooglePublishVideo);

export default router