import express from 'express';
import { adminRegister, getAllDoctors, getAllUsers, logoutAdmin, patientLogin, patientRegister } from '../controller/userController.js';
import {isAdminAuthenticated,isUserAuthenticated} from "../middlewares/auth.js";

const router=express.Router();

router.post("/patient/register", patientRegister); //post request to register a patient
router.post("/login", patientLogin); //post request to login a patient
router.post("/admin/addnew",isAdminAuthenticated,adminRegister);//post request to register a admin
router.get("/doctors",getAllDoctors);//to get all the doctors
router.get("/admin/me",isAdminAuthenticated,getAllUsers);
router.get("/patient/me",isUserAuthenticated,getAllUsers);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.get("/patient/logout",isUserAuthenticated,logoutAdmin);


export default router; //exporting the router