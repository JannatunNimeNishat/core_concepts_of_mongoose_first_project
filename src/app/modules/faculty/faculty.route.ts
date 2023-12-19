import { Router } from "express";
import { facultyControllers } from "./faculty.controller";
import validateRequest from "../../middlwares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import auth from "../../middlwares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get('/',auth(USER_ROLE.admin, USER_ROLE.faculty),facultyControllers.getAllFaculty)
router.get('/:id',facultyControllers.getSingleFaculty)
router.patch('/:id',validateRequest(facultyValidations.updateFacultyValidationSchema),facultyControllers.updateSingleFaculty)

router.delete('/:id',facultyControllers.deleteSingleFaculty)

export const facultyRoutes = router;
