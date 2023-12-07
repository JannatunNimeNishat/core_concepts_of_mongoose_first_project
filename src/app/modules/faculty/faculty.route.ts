import { Router } from "express";
import { facultyControllers } from "./faculty.controller";
import validateRequest from "../../middlwares/validateRequest";
import { facultyValidations } from "./faculty.validation";

const router = Router();

router.get('/',facultyControllers.getAllFaculty)
router.get('/:facultyId',facultyControllers.getSingleFaculty)
router.patch('/:facultyId',validateRequest(facultyValidations.updateFacultyValidationSchema),facultyControllers.updateSingleFaculty)


export const facultyRoutes = router;
