import express from "express";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
const app = express();
const __dirname = path.dirname("public");

app.use(cors({
    origin:process.env.CORS_ORIGIN, //frontend ka path dalna hai to frontend se req le sakta hai cors policy nahi tutegi
}))

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use("/users",userRouter)

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Welcome to YouTube Clone API"
    })
});

export default app;