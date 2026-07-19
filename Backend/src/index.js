import connectDB from "./db/db.js";
import app from "./app.js";

import express from "express"

connectDB().then(()=>{
    const server = app.listen(process.env.PORT || 8000 , ()=> {
        console.log(`Server is running on port ${process.env.PORT}`);
    })

    // Allow up to 10 minutes for large video uploads
    server.timeout = 10 * 60 * 1000;          // 10 min socket timeout
    server.keepAliveTimeout = 10 * 60 * 1000; // 10 min keep-alive

    server.on("error",(error)=>{
        console.log("There is a problem in hosting server",error.message);
    })
}).catch((error)=>{
    console.log("MONGO DB connection failed",error.message);
})