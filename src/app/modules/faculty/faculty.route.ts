import { Router } from "express";
import { facultyControllers } from "./faculty.controller";

const router = Router();

router.get('/',facultyControllers.getAllFaculty)
router.get('/:facultyId',facultyControllers.getSingleFaculty)



export const facultyRoutes = router;
