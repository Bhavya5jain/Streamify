import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from "../models/user.model.js"
import { DB_NAME } from '../constants.js';
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

const generateRefreshAndAccessTocken = async function (userId) {
    try {

        const user = await User.findById(userId);

        if (!user) {
            throw new apiError(404, "User not found with the given id");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();


        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new apiError(500, "Failed to generate access token and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some(field => !field || field.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    const isUserPresent = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserPresent) {
        throw new apiError(400, "User already exists with the given username or email");
    }

    if (!req.files?.avatar?.[0]?.path) {
        throw new apiError(400, "Avatar is required");
    }

    const avtarLocalPath = req.files.avatar[0].path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";

    const avtarUrl = await uploadOnCloudinary(avtarLocalPath);
    if (!avtarUrl) {
        throw new apiError(500, "Failed to upload avatar to Cloudinary");
    }

    const coverImageUrl = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    const CreatedUser = await User.create({
        username: username.toLowerCase(),
        fullName,
        password,
        email,
        avtar: avtarUrl.url,
        coverImage: coverImageUrl?.url || ""
    });

    const safeUser = await User.findById(CreatedUser._id).select("-password -refreshToken");
    if (!safeUser) {
        throw new apiError(500, "Failed to register user");
    }

    return res.status(201).json(new apiResponse(201, "User registered successfully", safeUser));
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if ((!email && !username) || !password) {
        throw new apiError(400, "Email/username and password are required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        throw new apiError(404, "User not found with the given email or username");
    }

    const checkPassword = await user.isPasswordCorrect(password);

    if (!checkPassword) {
        throw new apiError(401, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessTocken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new apiResponse(
                200,
                "logged in user successfully",
                {
                    user: loggedInUser, accessToken, refreshToken
                }
            )
        )

    // check weathure fields are valid or not
    // check into db weather t is present or not 
    // send response
    // divert the user to home page


})

const LogOutUser = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    await User.findByIdAndUpdate(_id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    );

    const option = {
        httpOnly: true,
        secure: true
    };

    res
        .clearCookie("refreshToken", option)
        .clearCookie("accessToken", option)
        .json(new apiResponse(200, "User logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const oldrefreshToken = req.cookies.refreshToken || req.body?.refreshToken;
    if (!oldrefreshToken) {
        throw new apiError(400, "refresh token not found");
    }
    const decodedRefreshToken = jwt.verify(oldrefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const _id = decodedRefreshToken._id;

    const user = await User.findById(_id);

    if (!user) {
        throw new apiError(400, "User not found through refresh token");
    }

    const { refreshToken, accessToken } = await generateRefreshAndAccessTocken(_id);

    if (oldrefreshToken !== user.refreshToken) {
        throw new apiError(400, "refresh token is expired or used");
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken)
        .cookie("accessToken", accessToken)
        .json(
            new apiResponse(200, "Successfully created AccessToken")
        )
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (await user.isPasswordCorrect(oldPassword)) {
        user.password = newPassword;
    } else {
        throw new apiError(400, "Invalid oldPassword");
    }

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new apiResponse(200, "Successfully changed old password"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, "User details", req.user))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (req.body?.password) {
        throw new apiError(400, "could not change password");
    }

    const user = await User.findByIdAndUpdate(_id,
        {
            $set: {
                ...req.body
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password")

    return res.status(200).json(new apiResponse(200, "Successfully updated data", user))

})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    const oldAvatarUrl = req.user.avatar;

    if (!avatarLocalPath) {
        throw new apiError(400, "error in updating through multer in controler");
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new apiError(400, "error in updating on cloundary in controller")
    }

    const deleteResponse = await deleteFromCloudinary(oldAvatarUrl)
    console.log("Old image deleated successfully");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avtar: avatar.url
            }
        }
    ).select("-password")

    return res.status(200)
        .json(new apiResponse(200, "Successfully updated avtar", user))
})

const updateUsercoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const oldcoverImageUrl = req.user.coverImage;

    if (!coverImageLocalPath) {
        throw new apiError(400, "error in updating through multer in controler");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new apiError(400, "error in updating on cloundary in controller")
    }

    const deleteResponse = await deleteFromCloudinary(oldcoverImageUrl);
    console.log("Old image deleated successfully");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        }
    ).select("-password")

    return res.status(200)
        .json(new apiResponse(200, "Successfully updated cover image", user))
})

const changePassword = asyncHandler(async (req, res) => {
    const { newPassword, conformNewPassword } = req.body;
    if (newPassword !== conformNewPassword) {
        throw new apiError(400, "new Password and Conform New Password is mismatched");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new apiError(404, "User not found with this email");
    }
    await User.findByIdAndUpdate(
        user._id,
        { $set: { password: newPassword } },
        { new: true }
    );
    res.status(200).json(new apiResponse(200, "Password changed successfully"));
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    console.log(username)
    console.log(req.user._id)
    if (!username?.trim()) {
        throw new apiError(400, "Username is required");
    }
    try {
        const channel = await User.aggregate([
            {
                $match: {
                    username: username
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "Subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribed to"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$Subscribers"
                    },
                    channelsSubscribed: {
                        $size: "$subscribed to"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [req.user._id, "$Subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribed: 1,
                    isSubscribed: 1,
                    avtar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ])
        console.log(channel)
        if (!channel?.length) {
            throw new apiError(404, "Channel not found with the given username", error.message);
        }
        res.status(200).json(new apiResponse(200, "Channel details", channel[0]));
    } catch (error) {
        throw new apiError(500, "Error while fetching channel details", error.message);
    }
})

const getWatchHistory = asyncHandler(async (req, res) => {
    try {
        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            }, {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner2",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avtar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: "$owner2"
                                }
                            }
                        }
                    ]
                }
            }
        ])

        if (!user.length) {
            throw new apiError(404, "User not found")
        }
        return res.status(200).json(new apiResponse(200, "User watch history", user[0].watchHistory))
    } catch (error) {
        throw new apiError(500, "Error while fetching watch history", error.message);
    }
})

const clearWatchHistory = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { watchHistory: [] } }
    );
    return res.status(200).json(new apiResponse(200, "Watch history cleared"));
})

export { registerUser, loginUser, LogOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUsercoverImage, changePassword, getUserChannelProfile, getWatchHistory, clearWatchHistory };