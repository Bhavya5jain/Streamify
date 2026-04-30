import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const getAllVideos = asyncHandler(async (req,res)=>{

})

const publishVideo = asyncHandler(async (req,res)=>{

    if(!req.files){
        new apiError(400,"video not found");
    }

    const cloudinaryUrl = uploadOnCloudinary(req.files.localPath)
    if(!cloudinaryUrl){
        new apiError(400,"failed to upload on cloudinary");
    }

    return res
    .status(200)
    .json({
        status:200,
        message:"video is published"
    })

})

const getVideoById = asyncHandler(async (req,res)=>{

})

const updateVideo = asyncHandler(async (req,res)=>{
    
})

const deleteVideo = asyncHandler(async (req,res)=>{

})

const tooglePublishVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;
})

export {getAllVideos,publishVideo,updateVideo,deleteVideo,tooglePublishVideo}