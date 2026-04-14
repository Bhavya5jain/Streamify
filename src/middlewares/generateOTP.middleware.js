import { asyncHandler } from "../utils/asyncHandler.js";
import {redis} from "../utils/redisClient.js"

export const generateOTP = asyncHandler(async(req,resizeBy,next)=>{
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const email = req.body.email;

    await redis.set(email,OTP,{EX : 300});

    next;
})