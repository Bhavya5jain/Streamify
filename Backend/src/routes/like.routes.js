import express from "express";
const router = express.Router();
import {toogleVideoLike,toogleCommentLike,toogleTweetLike,getVideoLikes,getCommentLikes,getTweetLikes} from "../controllers/like.controller.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js";

router.use(authMiddleware)

router.post("/video/:videoId",toogleVideoLike);
router.post("/comment/:commentId",toogleCommentLike);
router.post("/tweet/:tweetId",toogleTweetLike);
router.get("/video/:videoId",getVideoLikes);
router.get("/comment/:commentId",getCommentLikes);
router.get("/tweet/:tweetId",getTweetLikes);


export default router