import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authMiddleware = asyncHandler(async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
        if(!token){
            throw new apiError(400,"token not found for authorization");
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const {_id,email} = decodedToken;
    
        const user = await User.findById(_id).select("-paasword -refreshToken");
        if(!user){
            throw new apiError(400,"UnAuthorized Access");
        }

        req.user = user;
        next()
    } catch (error) {
        throw new apiError(401,error.message)
    }

    

 
})