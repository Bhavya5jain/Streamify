import express from "express";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // cookies/auth headers allow karne ke liye zaroori hai
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use("/users",userRouter)
app.use("/videos",videoRouter)
app.use("/playlists",playlistRouter)
app.use("/comments",commentRouter)
app.use("/likes",likeRouter)
app.use("/subscriptions",subscriptionRouter)
app.use("/tweets",tweetRouter)
app.use("/dashboard",dashboardRouter)

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Welcome to YouTube Clone API"
    })
});

export default app;