import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';

import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlwares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';
import auth from '../../middlwares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

//student  -> 
/** amra input e patasci file r data form-data hishbe pore format kore file ke locally save korteci r normal student data ke req.body te json akare kore nisci
step 1: uploading image loacly using multer -> upload function written on utils -> sendImageToCloudinary
input e file nam e astece ti "file"
* step2: frontend teka data text format form-date e asteca so amra req.body.data ke JSON.pare kore then req.body te assign kore dibo. eta amader data ta abar agar moto json format e asbe, abar validatoin e amra body te direct data validate kortam oi condition o match korteca. 
*/
router.post( '/create-student',auth(USER_ROLE.admin),
upload.single('file'),
(req:Request,res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);
    next();
},  
validateRequest(studentValidations.createStudentValidationSchema), 
UserControllers.createStudent,
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


//change user status (block or in-progress)
router.post('/change-status/:id',
auth(USER_ROLE.admin),
validateRequest(UserValidation.changeStatusValidationSchema),
UserControllers.changeStatus
)


export const UserRouters = router;
