import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UPLOAD_TIMEOUT_MS = 8 * 60 * 1000; // 8 minutes

const uploadOnCloudinary = (localFilePath) => {
    return new Promise((resolve, reject) => {
        if (!localFilePath) {
            console.log("No file path provided for Cloudinary upload");
            return resolve(null);
        }

        if (!fs.existsSync(localFilePath)) {
            console.log("File not found at path:", localFilePath);
            return resolve(null);
        }

        // Hard timeout — if Cloudinary takes too long, reject early
        const timer = setTimeout(() => {
            cleanup();
            reject(new Error("Cloudinary upload timed out after 8 minutes"));
        }, UPLOAD_TIMEOUT_MS);

        const cleanup = () => {
            clearTimeout(timer);
            try { fs.unlinkSync(localFilePath); } catch (_) {}
        };

        const ext = localFilePath.split('.').pop()?.toLowerCase() ?? '';
        const videoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm4v'];
        const resourceType = videoExts.includes(ext) ? 'video' : 'image';

        // Use upload_stream for memory-efficient streaming upload
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType },
            (error, response) => {
                cleanup();
                if (error) {
                    console.error("Cloudinary upload error:", error.message);
                    return reject(error);
                }
                console.log("File uploaded to Cloudinary:", response.url);
                resolve(response);
            }
        );

        const readStream = fs.createReadStream(localFilePath);

        readStream.on("error", (err) => {
            cleanup();
            reject(new Error("Failed to read local file: " + err.message));
        });

        readStream.pipe(uploadStream);
    });
};

const deleteFromCloudinary = async (oldAvatarUrl) => {
    try {
        if (!oldAvatarUrl) return null;
        const parts = oldAvatarUrl.split("/upload/")[1];
        const withoutVersion = parts.split("/").slice(1).join("/");
        const publicId = withoutVersion.split(".")[0];
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error("Failed to delete from Cloudinary:", error.message);
        return null;
    }
}


export {uploadOnCloudinary , deleteFromCloudinary};
