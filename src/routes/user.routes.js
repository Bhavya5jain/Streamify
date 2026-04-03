import express from "express"
const router = express.Router();
import {registerUser,loginUser , LogOutUser , refreshAccessToken} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import {authMiddleware} from "../middlewares/Auth.middleware.js"


try {
    router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);
} catch (error) {
    console.log("Failed to load user controller",error.message);
}

try {
  router.post("/login",loginUser);
} catch (error) {
  console.log("Failed to login",error.message);
}

try {
  router.post("/logout",authMiddleware,LogOutUser);
} catch (error) {
  console.log("Failed to logout",error.message);
}

try {
  router.post("/refreshAccessToken",authMiddleware,refreshAccessToken);
} catch (error) {
  console.log("Failed to generate refreshAccessToken ",error.message);
}

export default router;