import {asyncHandler} from '../utils/asyncHandler.js';
import {User} from "../models/user.model.js"
import { DB_NAME } from '../constants.js';
import {apiError} from "../utils/apiError.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"; 


const generateRefreshAndAccessTocken = async function(userId){
    try {

        const user =await User.findById(userId);
        
        if(!user){
            throw new apiError(404,"User not found with the given id");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};

    } catch (error) {
        throw new apiError(500,"Failed to generate access token and refresh token");
    }
}

const registerUser = asyncHandler( async (req,res)=>{
    console.log("Register user controller executed");
    console.log(req.body);
    const {fullName,username,email,password}=req.body;
    //DB_NAME.User.insertOne()
    // get user details{
    // Username --> MONGO_DB
    // email --> MONGO_DB
    // fullName --> MONGO_DB
    // avatar --> multer -->cloudinary
    // coverImage --> multer --> cloudinary
    // password --> encript(bcrypt) --> MONGO_DB
    // refreshToken(JWT)}
    if([fullName,username,email,password].some(field => field.trim() === "")){
        throw new apiError(400,"field is empty");
    }

    const isUserPresent = await User.findOne({
        $or:[{username},{email}]
    });

    if(isUserPresent){
        throw new apiError(400,"User already exists with the given username or email");
    }
    /* check validations{
        is any of field is empty
        is the email format is correct
        check if user already exists:username,email

    }
    */
   console.log("All validations passed");
   console.log(req.files);
   const avtarLocalPath = req.files.avatar[0].path;
   let coverImageLocalPath = "";
   console.log("check3");

   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0].path;
   }
   console.log("check4");
   
   
   if(!avtarLocalPath){
    throw new apiError(400,"Avtar not found");
   }

   const avtarUrl= await uploadOnCloudinary(avtarLocalPath); //response as URL
   const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath); //response as URL

   if(!avtarUrl){
    throw new apiError(400,"Avtar not found");
   }
   /*

    check for images,check for avtar
    upload them to cloudanary through multer
    take response from cloudanary as url of the file
    store the url in mongoDB
    check wheather the user is successfully registered
    */

    const data={username,
        fullName,
        password,
        email,
        avtar:avtarUrl.url,
        coverImage:coverImageUrl?.url || ""
    };
    console.log("Data to be stored in DB",data);
    const CreatedUser = await User.create(data);
    console.log("Created user in DB",CreatedUser);

    User.findById(CreatedUser._id).select("-password -refreshToken").then(()=>{
        console.log("User is successfully registerd");
        res.status(201).json(new apiResponse(201,"User is successfully registerd",CreatedUser));
    }).catch((error)=>{
        console.log("Failed to register user",error.message);
        throw new apiError(500,"Failed to register user");
    })
})

const loginUser = asyncHandler( async (req,res)=>{
    // email id
    // password

    const {email , password , username} = req.body;

    // validations
    if(!email && !password){
        throw new apiError(400,"Email and password are required");
    }

    const user = await User.findOne({$or:[{email},{username}]})

    if(!user){
        throw new apiError(404,"User not found with the given email or username");
    }

    const checkPassword = await user.isPasswordCorrect(password);

    if(!checkPassword){
        throw new apiError(401,"Password is incorrect");
    }
   
    const {accessToken, refreshToken} = await generateRefreshAndAccessTocken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const option = {
        httpOnly:true,
        secure : true
    };

    res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new apiResponse(
            200,
            {
                user : loggedInUser,accessToken,refreshToken
            },
            "logged in user succefully"
        )
    )

    // check weathure fields are valid or not
    // check into db weather t is present or not 
    // send response
    // divert the user to home page


})

const LogOutUser = asyncHandler( async (req,res)=>{
    const _id = req.user._id;
    User.findByIdAndUpdate(_id,
        {
            $set:{"refreshToken":undefined}
        },
    {
        new:true
    })

    const option = {
        httpOnly : true,
        secure : true 
    }

    res
    .clearCookie("refreshToken",option)
    .clearCookie("accessToken",option)
    .json(new apiResponse(200,"User logged out successfully"));
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const oldrefreshToken = req.cookies.refreshToken || req.body?.refreshToken;
    if(!oldrefreshToken){
        throw new apiError(400 , "refresh token not found");
    }
    const decodedRefreshToken = jwt.verify(oldrefreshToken,process.env.REFRESH_TOKEN_SECRET);

    const _id=decodedRefreshToken._id;

    const user = await User.findById(_id);

    if(!user){
        throw new apiError(400,"User not found through refresh token");
    }

    const {refreshToken , accessToken } = await generateRefreshAndAccessTocken(_id);

    if(oldrefreshToken !== user.refreshToken){
        throw new apiError(400,"refresh token is expired or used");
    }

    return res
    .status(200)
    .cookie("refreshToken",refreshToken)
    .cookie("accessToken",accessToken)
    .json(
        new apiResponse(200,"Successfully created AccessToken")
    )
})

export {registerUser, loginUser , LogOutUser ,refreshAccessToken};