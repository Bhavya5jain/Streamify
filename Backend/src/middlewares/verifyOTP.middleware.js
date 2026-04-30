import { asyncHandler } from "../utils/asyncHandler.js";
import {redis} from "../utils/redisClient.js"
import {apiError} from "../utils/apiError.js"



export const verifyOTP = asyncHandler(async(req,res,next)=>{
    const {OTP,email} = req.body;
    
    const originlOTP = await redis.get(email);

    if(OTP === originlOTP){
        next;
    }else{
        throw new apiError(400,"wrong OTP");
    }
})

