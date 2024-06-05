import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateAccessToken } from "../utils/jwtTokens.js";

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  } = req.body; //from the frontend
  //if anything is missing
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !role
  ) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  //if the email is already registered
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  //if not register we will create the user
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  });

  generateAccessToken(user, "User Registered Successfully", 200, res);
});

//now logic for loging in the user
export const patientLogin = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  //if password doesn't match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  //finding the user in the database
  const user = await User.findOne({ email }).select("+password"); //this can be used to select things that we have set to false in the schema
  //if not found
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  //check if the password is correct
  const isPasswordMatch = await user.comparePassword(password);
  //if password is not correct
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  //if role doesn't match
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid Role", 401));
  }

  generateAccessToken(user, "User Logged in Successfully", 200, res);
});

//now the function for creating new admin
export const adminRegister = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  //if anything is missing
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }
  //check if the admin is already registered
  const isRegister = await User.findOne({ email });
  if (isRegister) {
    return next(new ErrorHandler("Admin already exists", 400));
  }
  //if not register we will create the user
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "admin", //setting the role to admin statically
  });
  //send the message
  res.status(200).json({
    success: true,
    message: "Admin Registered Successfully",
  });
});
