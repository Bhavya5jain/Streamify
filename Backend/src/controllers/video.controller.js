import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// GET /videos  →  list all videos with search + pagination
// ─────────────────────────────────────────────
const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId,
        category,
    } = req.query;

    const matchStage = { isPublished: true };

    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { discription: { $regex: query, $options: "i" } },
        ];
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new apiError(400, "Invalid userId");
        }
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    // Filter by category if provided and not "All"
    if (category && category !== "All") {
        matchStage.category = { $regex: `^${category}$`, $options: "i" };
    }

    const aggregatePipeline = Video.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avtar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
            },
        },
        {
            $sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
        },
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const videos = await Video.aggregatePaginate(aggregatePipeline, options);

    return res
        .status(200)
        .json(new apiResponse(200, "Videos fetched successfully", videos));
});

// ─────────────────────────────────────────────
// POST /videos  →  publish a new video
// ─────────────────────────────────────────────
const publishVideo = asyncHandler(async (req, res) => {
    const { title, discription, category } = req.body;

    if (!title?.trim()) {
        throw new apiError(400, "Title is required");
    }

    if (!req.files || !req.files.videoFile) {
        throw new apiError(400, "Video file is required");
    }

    const videoLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path || "";

    // Upload video to cloudinary
    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    if (!videoUpload) {
        throw new apiError(500, "Failed to upload video on Cloudinary");
    }

    // Upload thumbnail to cloudinary (optional)
    // If no thumbnail provided, auto-generate one from the video at the 2-second mark
    let autoThumbnailUrl = "";
    if (videoUpload.public_id) {
        // Cloudinary URL transformation: grab frame at 2s, convert to jpg, 1280x720
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        autoThumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_1280,h_720,c_fill,f_jpg/${videoUpload.public_id}.jpg`;
    }

    let thumbnailUpload = null;
    if (thumbnailLocalPath) {
        thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
    }

    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload?.url || autoThumbnailUrl,
        title: title.trim(),
        discription: discription?.trim() || "",
        category: category?.trim() || "General",
        duration: videoUpload.duration || 0,
        owner: req.user._id,
        isPublished: true,
    });

    if (!video) {
        throw new apiError(500, "Failed to save video in database");
    }

    return res
        .status(201)
        .json(new apiResponse(201, "Video published successfully", video));
});

// ─────────────────────────────────────────────
// GET /videos/:videoId  →  get single video + increment views
// ─────────────────────────────────────────────
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    // Increment views atomically and return updated doc
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).populate("owner", "fullName username avtar");

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    if (!video.isPublished && video.owner._id.toString() !== req.user._id.toString()) {
        throw new apiError(403, "This video is private");
    }

    // Auto-track watch history — $addToSet prevents duplicates
    await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { watchHistory: videoId } }
    );

    return res
        .status(200)
        .json(new apiResponse(200, "Video fetched successfully", video));
});

// ─────────────────────────────────────────────
// PUT /videos/:videoId  →  update title / description / thumbnail
// ─────────────────────────────────────────────
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, discription } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Only owner can update
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to update this video");
    }

    const updateFields = {};
    if (title?.trim()) updateFields.title = title.trim();
    if (discription?.trim()) updateFields.discription = discription.trim();

    // Handle optional thumbnail update
    if (req.files?.thumbnail?.[0]?.path) {
        const thumbnailLocalPath = req.files.thumbnail[0].path;
        const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!newThumbnail) {
            throw new apiError(500, "Failed to upload new thumbnail");
        }

        // Delete old thumbnail from cloudinary
        if (video.thumbnail) {
            await deleteFromCloudinary(video.thumbnail);
        }

        updateFields.thumbnail = newThumbnail.url;
    }

    if (Object.keys(updateFields).length === 0) {
        throw new apiError(400, "No fields provided to update");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(new apiResponse(200, "Video updated successfully", updatedVideo));
});

// ─────────────────────────────────────────────
// DELETE /videos/:videoId  →  delete video + cloudinary assets
// ─────────────────────────────────────────────
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Only owner can delete
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to delete this video");
    }

    // Delete assets from cloudinary
    if (video.videoFile) {
        await deleteFromCloudinary(video.videoFile);
    }
    if (video.thumbnail) {
        await deleteFromCloudinary(video.thumbnail);
    }

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new apiResponse(200, "Video deleted successfully", {}));
});

// ─────────────────────────────────────────────
// POST /videos/:videoId/toggle-publish  →  toggle isPublished
// ─────────────────────────────────────────────
const tooglePublishVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Only owner can toggle
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to update this video");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                `Video is now ${video.isPublished ? "published" : "unpublished"}`,
                { isPublished: video.isPublished }
            )
        );
});

export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo, tooglePublishVideo };