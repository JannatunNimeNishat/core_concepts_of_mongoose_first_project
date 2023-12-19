import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { courseValidation } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';



const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(courseValidation.createCourseValidationSchema),
 CourseControllers.createCourse,
);

router.get('/',CourseControllers.getAllCourses);

router.get('/:id',auth(USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),CourseControllers.getSingleCourse)
router.patch('/:id',auth(USER_ROLE.admin),validateRequest(courseValidation.updateCourseValidationSchema),CourseControllers.updateCourse)

router.delete('/:id',auth(USER_ROLE.admin),CourseControllers.deleteCourse)

//course ta kun kun faculty nisce tar api
//akta course multiple Faculty nite pare.
router.put('/:courseId/assign-faculties',validateRequest(courseValidation.facultiesWithCourseValidationSchema),CourseControllers.assignFacultiesWithCourse) 

//course teka assigned faculty ke delete kora r route
router.delete('/:courseId/remove-faculties',validateRequest(courseValidation.facultiesWithCourseValidationSchema),CourseControllers.removeFacultiesFromCourse) 



export const CourseRoutes = router;
