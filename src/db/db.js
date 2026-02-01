import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv"


dotenv.config()

const connectDB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(connectionInstance);
    }catch(error){
        console.log("server failed to connect with mongoDB",error.message);
        process.exit(1);
    }
}

export default connectDB;