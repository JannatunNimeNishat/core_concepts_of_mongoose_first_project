import { Router } from "express";
import { facultyControllers } from "./faculty.controller";

const router = Router();

router.get('/',facultyControllers.getAllFaculty)




export const facultyRoutes = router;
