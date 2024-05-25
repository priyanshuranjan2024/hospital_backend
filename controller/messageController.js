import { Message } from "../models/messageSchema.js";

//we will use the message model to create a new message and save it to the database
//so we will create a controller to handle the request

//note that if we do res,req it will give error so we will do req,res

export const sendMessage = async (req,res,next) => {
  //firstly we will get the data from the request body that is frontend
  const { firstName, lastName, email, phone, message } = req.body;
  //now we will check if any of these data is not provided
  if (!firstName || !lastName || !email || !phone || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }
  //now we will send the message to the database
  await Message.create({ firstName, lastName, email, phone, message });
  //if the message is sent successfully then we will send the response
  res.status(200).json({ success: true, message: "Message Sent Successfully" });
};
