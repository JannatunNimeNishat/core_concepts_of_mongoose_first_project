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

//course ta kun kun faculty nisce tar api
//akta course multiple Faculty nite pare.
router.put('/:courseId/assign-faculties',validateRequest(courseValidation.facultiesWithCourseValidationSchema),CourseControllers.assignFacultiesWithCourse) 

//course teka assigned faculty ke delete kora r route
router.put('/:courseId/remove-faculties',validateRequest(courseValidation.facultiesWithCourseValidationSchema),CourseControllers.removeFacultiesFromCourse) 



export const CourseRoutes = router;
