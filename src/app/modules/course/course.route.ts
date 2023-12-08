import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { courseValidation } from './course.validation';
import { CourseControllers } from './course.controller';



const router = express.Router();

router.post(
  '/create-course',
  validateRequest(courseValidation.createCourseValidationSchema),
 CourseControllers.createCourse,
);

router.get('/',CourseControllers.getAllCourses);

router.get('/:id',CourseControllers.getSingleCourse)
router.patch('/:id',validateRequest(courseValidation.updateCourseValidationSchema),CourseControllers.updateCourse)

router.delete('/:id',CourseControllers.deleteCourse)



export const CourseRoutes = router;
