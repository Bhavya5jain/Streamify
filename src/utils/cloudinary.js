import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { asyncHandler } from './asyncHandler.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            console.log("did not find the path for uploading on cloudanary")
            return;
        }
        // upload the file
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
        console.log("File is uploded on cloudinary",response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Failed to upload on cloudinary",error.message);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = asyncHandler(async(oldAvatarUrl)=>{
    const parts = oldAvatarUrl.split("/upload/")[1];
    const withoutVersion = parts.split("/").slice(1).join("/");
    const publicId = withoutVersion.split(".")[0];
    const response = await cloudinary.uploader.destroy(publicId);
    return response;

})


export {uploadOnCloudinary , deleteFromCloudinary};