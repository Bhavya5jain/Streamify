import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {User} from "./user.model.js"
const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,
        required:[true,"video is deleated"]
    },
    thumbnail:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        default:"Stringify Video"
    },
    discription:{
        type:String,
        default:"Stringify Video"
    },
    category:{
        type:String,
        default:"General"
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);