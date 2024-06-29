import express from 'express';
import { deleteAppointment,updateAppointmentStatus,getAllAppointments, postAppointment } from '../controller/appointmentController.js';
import {isAdminAuthenticated,isUserAuthenticated} from "../middlewares/auth.js";


const router =express.Router();

//the appointment should be done only by registered users
//so we will add an authentication middleware

router.post("/post",isUserAuthenticated,postAppointment);
router.get("/getall",isAdminAuthenticated,getAllAppointments);
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus);
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment);


export default router;
