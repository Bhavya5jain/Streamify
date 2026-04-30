import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheckController = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"API is working fine"
    })
})

export {healthCheckController}