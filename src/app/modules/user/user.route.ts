import express from 'express';
import { UserControllers } from './user.controller';

import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlwares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';
import auth from '../../middlwares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

//student  -> 
//auth role check:  new student shudu admin e create korte parbe. eita varify korte auth middleware e user er role ta pathano hosce, ai role r accessToken decoded korar pore je role asbe ai 2 ta match korlai kabol student create korte parbe.
router.post( '/create-student',auth(USER_ROLE.admin),validateRequest(studentValidations.createStudentValidationSchema), UserControllers.createStudent,
); //we can't pass parameter with middleware so we use a higher order function. So that we can pass parameter because we are validating data we need schema

//faculty
router.post('/create-faculty',auth(USER_ROLE.admin), validateRequest(facultyValidations.createFacultyValidationSchema), UserControllers.createFaculty)

//admin
router.post('/create-admin',
// auth(USER_ROLE.admin),
validateRequest(adminValidation.createAdminValidationSchema),UserControllers.createAdmin);


//new 
// me route
/*akta specific user er data jate onno user na pai. token takar por o jate akjon er data onno jon na pai */
router.get('/me',
auth(USER_ROLE.student,USER_ROLE.admin,USER_ROLE.faculty),
UserControllers.getMe
)


export const UserRouters = router;
