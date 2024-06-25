import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler("Admin is not authenticated", 401));
  }
  //if the token is available then we will verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorized for this resources`,
        403
      )
    );
  }
  next();
});

//now authorize the user
export const isUserAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401));
  }
  //if the token is available then we will verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  //now authorize the user
  if (req.user.role !== "user") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorized for this resources`,
        403
      )
    );
  }
  next();
});
