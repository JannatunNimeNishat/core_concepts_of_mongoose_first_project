import { Router } from "express";
import validateRequest from "../../middlwares/validateRequest";
import { SemesterRegistrationValidation } from "./semesterRegistration.validatoin";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";

const router = Router();



router.post('/create-semester-registration', validateRequest(SemesterRegistrationValidation.createSemesterRegistrationValidationSchema),SemesterRegistrationControllers.createSemesterRegistration)




export const SemesterRegistrationRoutes = router;