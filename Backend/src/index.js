import connectDB from "./db/db.js";
import app from "./app.js";

import express from "express"

connectDB().then(()=>{
    const server = app.listen(process.env.PORT || 8000 , ()=> {
        console.log(`Server is running on port ${process.env.PORT}`);
    })

    server.on("error",(error)=>{
        console.log("There is a problem in hosting server",error.message);
    })
}).catch((error)=>{
    console.log("MONGO DB connection failed",error.message);
})