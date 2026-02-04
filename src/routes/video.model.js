import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
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
        ref:User,
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
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema);