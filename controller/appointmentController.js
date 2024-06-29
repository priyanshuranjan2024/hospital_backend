import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

//create the function for creating an appointment
export const postAppointment = catchAsyncError(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;

    //check if any of the fields are empty
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !hasVisited ||
        !address
    ) {
        return next(new ErrorHandler('Please fill in all the fields', 400));
    }

    //check if two doctors have the same name and also check if the doctor is there or not
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: 'doctor',
        doctorDepartment: department
    });
    //if doctor is not found 
    if (isConflict.length === 0) {
        return next(new ErrorHandler('Doctor not found', 404));
    }
    //if doctors are more than one
    if (isConflict.length > 1) {
        return next(new ErrorHandler('There are more than one doctor with the same name', 400));
    }
    //take the doctor id
    const doctorId = isConflict[0]._id;
    //take the patient id
    const patientId = req.user._id;
    //create the appointment
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId,
    });
    //send the response
    res.status(200).json({
        success: true,
        message: 'Appointment created successfully',
        appointment,
    });

});


//create the function for getting all the appointments
//this function is only for the admin
//so there will be a middleware to authenticate the admin
export const getAllAppointments = catchAsyncError(async (req, res, next) =>{
    const appointments = await Appointment.find();
    //send the response
    res.status(200).json({
        success:true,
        appointments,
    });
});

export const updateAppointmentStatus=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    //if appointment is not found
    if(!appointment){
        return next(new ErrorHandler('Appointment not found',404));
    }
    //update the status
    appointment=await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
        message:'Appointment updated successfully',
        appointment,
    });

});

//function to delete the appointment
export const deleteAppointment=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    //if appointment is not found
    if(!appointment){
        return next(new ErrorHandler('Appointment not found',404));
    }
    //delete the appointment
    await appointment.deleteOne();
    //send the response
    res.status(200).json({
        success:true,
        message:'Appointment deleted successfully',
    });
});