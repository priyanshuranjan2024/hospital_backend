import express from 'express';
import { addNewDoctor, adminRegister, getAllDoctors, getAllUsers, logoutAdmin, logoutPatient, patientLogin, patientRegister } from '../controller/userController.js';
import {isAdminAuthenticated,isUserAuthenticated} from "../middlewares/auth.js";

const router=express.Router();

router.post("/patient/register", patientRegister); //post request to register a patient
router.post("/login", patientLogin); //post request to login a patient
router.post("/admin/addnew",isAdminAuthenticated,adminRegister);//post request to register a admin
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor);//post request to add a new doctor
//remember the isAdminAuthenticated is a middlware that will make sure that only a register admin can add a new doctor





router.get("/doctors",getAllDoctors);//to get all the doctors
router.get("/admin/me",isAdminAuthenticated,getAllUsers);
router.get("/patient/me",isUserAuthenticated,getAllUsers);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.get("/patient/logout",isUserAuthenticated,logoutPatient);


export default router; //exporting the router