import { Router } from "express";
import validateRequest from "../../middlwares/validateRequest";
import { offeredCourseValidations } from "./offeredCourse.validation";
import { OfferedCourseControllers } from "./offeredCourse.controller";

const router = Router();

router.post('/create-offered-course', validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),OfferedCourseControllers.createOfferCourse);






export const OfferedCourseRoutes = router;