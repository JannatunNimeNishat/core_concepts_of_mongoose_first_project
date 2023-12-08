import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlwares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();



router.get('/', StudentControllers.getStudents);
//we are using mongodb _id here instead of our generated id 
router.get('/:id', StudentControllers.getSingleStudent);
router.patch('/:id',validateRequest(studentValidations.updateStudentValidationSchema) ,StudentControllers.updateStudent);

router.delete('/:id', StudentControllers.deleteStudent);

export const studentRoutes = router;
