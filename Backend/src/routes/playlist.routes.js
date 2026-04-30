import express from "express";
const router = express.Router();
import {createPlayList,getAllPlayLists,getPlayListById,addVideosToPlayList,removeVideosFromPlayList,deletePlayList} from "../controllers/playlist.controller.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js";

router.use(authMiddleware)

router.post("/",createPlayList);
router.get("/",getAllPlayLists);
router.get("/:playListId",getPlayListById);
router.post("/:playListId/videos",addVideosToPlayList);
router.delete("/:playListId/videos/:videoId",removeVideosFromPlayList);
router.delete("/:playListId",deletePlayList);

export default router