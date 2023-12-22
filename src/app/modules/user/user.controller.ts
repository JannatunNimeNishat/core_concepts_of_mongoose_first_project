// import studentValidationSchema from './student.validation';

import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';


const createStudent = catchAsync(async (req, res) => {
  // RequestHandler -> createStudent er req:Request, res:Response next:NextFunction er type auto declare kore dey
/*   console.log('file',req.file);
  console.log(req.body); */

 const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentIntoDB(req.file,password, studentData);

  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student is created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await UserServices.createFacultyIntoDB(password, facultyData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Faculty is created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async(req,res)=>{
  const {password, admin:adminData} = req.body;
  const result = await UserServices.createAdminIntoDB(password,adminData)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin is created successfully',
    data: result,
  });
})

//me controller
const getMe = catchAsync(async(req,res)=>{

  const result = await UserServices.getMeFromDB(req.user)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is retrieved successfully',
    data: result,
  });
})

const changeStatus = catchAsync(async(req,res)=>{
  const id = req.params.id;
  const result = await UserServices.changeStatusIntoDB(id,req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is status is changed successfully',
    data: result,
  });
})

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus
};
