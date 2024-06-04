import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name should be at least 3 characters long"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name should be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number should be excatly 10 Digit long"],
    maxLength: [10, "Phone number should be excatly 10 Digit long"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [13, "NIC should be exactly 13 characters long"],
    maxLength: [13, "NIC should be exactly 13 characters long"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password should be at least 8 characters long"],
    select: false, //this will not show the password in the response that means it is not stored in the database
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "doctor"],
    default: "user",
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});


//now we should hash the password before saving it to the database
userSchema.pre("save", async function (next) { //this means before saving the document to the database
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//to compare the password entered by the user with the password stored in the database we
//will create a method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
};

//now when the user will login it should also create a token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


export const User = mongoose.model("User", messageSchema);
