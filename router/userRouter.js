import express from 'express';
import { adminRegister, patientLogin, patientRegister } from '../controller/userController.js';

const router=express.Router();

router.post("/patient/register", patientRegister); //post request to register a patient
router.post("/login", patientLogin); //post request to login a patient
router.post("/admin/addnew",adminRegister);//post request to register a admin

export default router; //exporting the router