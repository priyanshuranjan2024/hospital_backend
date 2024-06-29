import express from 'express';
import { getMessages, sendMessage } from '../controller/messageController.js';
import {isAdminAuthenticated} from "../middlewares/auth.js";

//what is router
// The primary function of a router is to map incoming client
// requests to specific backend functions
// or handlers. When a client sends a request
//  (such as a POST request to add data to a database),
//   the router determines which function should handle the 
//   request based on the request's URL and HTTP method
// (GET, POST, PUT, DELETE, etc.).

const messageRouter = express.Router();

//now we will import the controller and give the route to the controller
messageRouter.post("/send",sendMessage);


messageRouter.get("/getAll",isAdminAuthenticated,getMessages);

//now we will export the router and use it in the app.js
export default messageRouter;