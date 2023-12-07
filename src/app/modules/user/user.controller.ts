// import studentValidationSchema from './student.validation';

import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  // RequestHandler -> createStudent er req:Request, res:Response next:NextFunction er type auto declare kore dey

  const { password, student: studentData } = req.body;

  //will call service func to send this data
  const result = await UserServices.createStudentIntoDB(password, studentData);

  //handling response by using utility sendResponse function
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

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
};
