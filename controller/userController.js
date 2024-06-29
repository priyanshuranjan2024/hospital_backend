import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateAccessToken } from "../utils/jwtTokens.js";
import cloudinary from "cloudinary";

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

//get all the doctors
export const getAllDoctors = catchAsyncError(async (req, res, next) => {
  const doctors = await User.find({ role: "doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

//get all the users data
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged out successfully",
    });
});

export const logoutPatient = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged out successfully",
    });
});


export const addNewDoctor = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("No files were uploaded", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("Please upload an image file", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  //check if the user is already registered
  const isRegister = await User.findOne({ email});
  if (isRegister) {
    return next(new ErrorHandler(`${isRegister.role} already registered with this email`, 400));
  }

  //now will export the image to cloudinary
  const cloudinaryImage=await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if(!cloudinaryImage || cloudinaryImage.error){
    console.log(cloudinaryImage.error|| "Error in uploading image to cloudinary");
  }
  //now will create the user
  const doctor=await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "doctor", 
    docAvatar:{
      public_id:cloudinaryImage.public_id,
      url:cloudinaryImage.secure_url
    },

  });
  res.status(200).json({
    success:true,
    message:"Doctor Registered Successfully",
    doctor
  });
  



  

})