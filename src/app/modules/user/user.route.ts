import express from 'express';
import { UserControllers } from './user.controller';

import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlwares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';

const router = express.Router();

//student
router.post( '/create-student',validateRequest(studentValidations.createStudentValidationSchema), UserControllers.createStudent,
); //we can't pass parameter with middleware so we use a higher order function. So that we can pass parameter because we are validating data we need schema

//faculty
router.post('/create-faculty', validateRequest(facultyValidations.createFacultyValidationSchema), UserControllers.createFaculty)


export const UserRouters = router;
