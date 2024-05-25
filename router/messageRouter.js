import express from 'express';
import { sendMessage } from '../controller/messageController.js';

//what is router
// The primary function of a router is to map incoming client requests to specific backend functions
// or handlers. When a client sends a request
//  (such as a POST request to add data to a database),
//   the router determines which function should handle the 
//   request based on the request's URL and HTTP method (GET, POST, PUT, DELETE, etc.).

const messageRouter = express.Router();

//now we will import the controller and give the route to the controller
messageRouter.post("/send",sendMessage);

//now we will export the router and use it in the app.js
export default messageRouter;