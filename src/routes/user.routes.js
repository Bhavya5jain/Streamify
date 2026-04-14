import express from "express"
const router = express.Router();
import {registerUser,loginUser , LogOutUser , refreshAccessToken ,changeCurrentPassword ,updateAccountDetails ,updateUserAvatar ,updateUsercoverImage ,getUserChannelProfile ,getWatchHistory ,getCurrentUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js"
import multer from "multer";
import {generateOTP} from "../middlewares/generateOTP.middleware.js";
import {verifyOTP} from "../middlewares/verifyOTP.middleware.js";
import {changePassword} from "../controllers/user.controller.js";


    router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);
router.post("/login",loginUser);
router.post("/logout",authMiddleware,LogOutUser);
router.post("/refreshAccessToken",authMiddleware,refreshAccessToken);
router.post("/changeCurrentPassword",authMiddleware,changeCurrentPassword);
router.patch("/updateAccountDetails",authMiddleware,updateAccountDetails)
router.patch("/updateUserAvatar",authMiddleware,upload.fields([{ name: "avatar", maxCount: 1 }]),updateUserAvatar)
router.patch("/updateUsercoverImage",authMiddleware,upload.fields([{ name: "coverImage", maxCount: 1 }]),updateUsercoverImage)
//router.get("/forgot-password",generateOTP,verifyOTP,changePassword)
router.get("/getUserChannelProfile/c/:username",authMiddleware,getUserChannelProfile)
router.get("/getWatchHistory",authMiddleware,getWatchHistory)
router.get("/getCurrentUser",authMiddleware,getCurrentUser)


export default router;