import connectDB from "./db/db.js";
import app from "./app.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express"

app.use(cors({
    origin:process.env.CORS_ORIGIN, //frontend ka path dalna hai to frontend se req le sakta hai cors policy nahi tutegi
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

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