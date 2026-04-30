import express from "express";
const router = express.Router();
import {createTweet,getAllTweets,getTweetById,updateTweet,deleteTweet} from "../controllers/tweet.controller.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js";

router.use(authMiddleware)

router.post("/",createTweet);
router.get("/",getAllTweets);
router.get("/:tweetId",getTweetById);
router.put("/:tweetId",updateTweet);
router.delete("/:tweetId",deleteTweet);


export default router