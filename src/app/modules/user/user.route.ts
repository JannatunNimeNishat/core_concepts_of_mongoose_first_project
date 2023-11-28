import express from 'express';
import { UserControllers } from './user.controller';

import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlwares/validateRequest';

const router = express.Router();



router.post( '/create-student',validateRequest(studentValidations.createStudentValidationSchema), UserControllers.createStudent,
); //we can't pass parameter with middleware so we use a higher order function. So that we can pass parameter because we are validating data we need schema

export const UserRouters = router;
