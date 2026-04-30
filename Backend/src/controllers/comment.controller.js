import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment} from "../models/Comment.model.js";
import {Video} from "../models/Video.model.js";
import {Tweet} from "../models/Tweet.model.js";

const getVideoComments = asyncHandler(async (req,res)=>{

})

const addVideoComment = asyncHandler(async (req,res)=>{
    const {id} = req.params.id;
    const {content} = req.body;
    const {user_id}= req.user._id;

    if(!id){
        new apiError("Video id is required",400)
    }
    if(!content){
        new apiError("Comment content is required",400)
    }
    
    const video = await Video.findById(id);
    if(video){
        const commit = await Comment.create({
            content:content,
            video:id,
            owner:user_id
        });

        if(!commit){
            new apiError(500,"failed to commit the comment")
        }
        return res
        .status(200)
        .json({
            status:200,
            message:"video comment created"
        })
    }
    new apiError(400,"Video not found for commenting");

})

const addTweetComment = asyncHandler(async(req,res)=>{

})

const updateComment = asyncHandler(async (req,res)=>{

})

const deleteComment = asyncHandler(async (req,res)=>{

})

export {getVideoComments,addVideoComment,deleteComment,updateComment,addTweetComment}