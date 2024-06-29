import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
    appointment_date:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    doctor:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },  
    },
    hasVisited:{
        type:Boolean,
        default:false,
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Approved","Rejected"],
        default:"Pending"
    },
  });

  export const Appointment = mongoose.model("Appointment", appointmentSchema);
  