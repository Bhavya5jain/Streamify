import express from "express";
import {getVideoComments,addVideoComment,deleteComment,updateComment,addTweetComment} from "../controllers/comment.controller.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js";

const router = express.Router();
router.use(authMiddleware)

router.post("/",addVideoComment);
router.get("/:videoId",getVideoComments);
router.delete("/:commentId",deleteComment);

export default router