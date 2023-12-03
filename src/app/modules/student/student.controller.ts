
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';



const getStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'students are retrieved successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {

    //
    const { studentId } = req.params;
    //calling service
    const result = await StudentServices.getSingleStudentFormDB(studentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'student is retrieved successfully',
      data: result,
    });
  
});


const updateStudent= catchAsync(async (req, res) => {
  
    const { studentId } = req.params;
    const {student} = req.body;
    const result = await StudentServices.updateStudentIntoDB(studentId, student);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Student is Successfully updated',
      data: result,
    });
 
});
const deleteStudent= catchAsync(async (req, res) => {
  
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Successfully deleted',
      data: result,
    });
 
});

export const StudentControllers = {
  getStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
