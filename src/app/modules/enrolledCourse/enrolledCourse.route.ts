import { Router } from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { EnrollCoursesValidations } from './enrolledCourse.validation';
import { EnrollCoursesController } from './enrolledCourse.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// sudu student e course e enroll korte parbe. student id req.headers.authorization e accessToken e peya jabo. that means input teka accessToken tao pathate hobe course e enroll korte.
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    EnrollCoursesValidations.createEnrollCourseValidationZodSchema,
  ),
  EnrollCoursesController.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty),
  validateRequest(
    EnrollCoursesValidations.updateEnrolledCourseMarksValidationSchema,
  ),
  EnrollCoursesController.updateEnrolledCourseMarks,
);

export const EnrollCoursesRoutes = router;
