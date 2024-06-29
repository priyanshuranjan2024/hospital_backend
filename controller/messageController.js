import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import { Message } from "../models/messageSchema.js";
import  ErrorHandler  from "../middlewares/errorMiddleware.js";

//if you don't want your server to crash due to any error then you can use
//a middleware error handler that will catch the error and send the response
//this will prevent the  error from crashing the server


//we will use the message model to create a new message and save it to the database
//so we will create a controller to handle the request

//note that if we do res,req it will give error so we will do req,res

export const sendMessage = catchAsyncError(async (req,res,next) => {
  //firstly we will get the data from the request body that is frontend
  const { firstName, lastName, email, phone, message } = req.body;
  //now we will check if any of these data is not provided
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill all the fields",400));
  }
  //now we will send the message to the database
  await Message.create({ firstName, lastName, email, phone, message });
  //if the message is sent successfully then we will send the response
  res.status(200).json({ success: true, message: "Message Sent Successfully" });
});

//function to get all messages
export const getMessages = catchAsyncError(async (req,res,next) => {
  const messages = await Message.find();
  res.status(200).json({ success: true, messages });
});
