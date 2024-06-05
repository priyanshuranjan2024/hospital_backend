import express from 'express';
import { config } from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";
import { dbConnect } from './database/dbConnect.js';
import messageRouter from './router/messageRouter.js';
import userRouter from "./router/userRouter.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js";


const app = express();

config({path:"./config/config.env"});


//now make middleware to connect to the frontend
app.use(cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],//the methods we are going to use
    credentials:true,//to allow cookies
}));

//the second middleware we will use is to parse cookie
app.use(cookieParser());

//the third middleware we will use is to parse json
app.use(express.json());

//the forth middleware we will use is to parse urlencoded data
app.use(express.urlencoded({extended:true}));

//the fifth middlware is to upload files
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));

//now we will import the router and use it
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);

//connect to the database
dbConnect();

//now we will use the error middleware
app.use(errorMiddleware);


export default app;