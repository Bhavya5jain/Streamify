import { asyncHandler } from "../utils/asyncHandler";
import nodemailer from "nodemailer"

const mailer = asyncHandler(async(req , res , next)=>{
    const message = {
        from : "jainbhavya0527@gmail.com",
        to: "bhavya.jain_cs23@gla.ac.in",
        subject : "OTP",
        text:`Your OTP is ${OPT}`
    }
})