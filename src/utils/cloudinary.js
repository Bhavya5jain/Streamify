import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

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


export {uploadOnCloudinary};