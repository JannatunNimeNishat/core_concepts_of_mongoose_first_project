import { Router } from "express";
import { facultyControllers } from "./faculty.controller";
import validateRequest from "../../middlwares/validateRequest";
import { facultyValidations } from "./faculty.validation";

const router = Router();

router.get('/',facultyControllers.getAllFaculty)
router.get('/:id',facultyControllers.getSingleFaculty)
router.patch('/:id',validateRequest(facultyValidations.updateFacultyValidationSchema),facultyControllers.updateSingleFaculty)

router.delete('/:id',facultyControllers.deleteSingleFaculty)

export const facultyRoutes = router;
