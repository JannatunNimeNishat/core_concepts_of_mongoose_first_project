import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';

const getStudents = async (req: Request, res: Response, next:NextFunction) => {
  try {
    //service
    const result = await StudentServices.getAllStudentsFromDB();
    //res
   /*  res.status(400).json({
      success: true,
      message: 'students are retrieved successfully',
      data: result,
    }); */
    sendResponse(res,{
      success:true,
      statusCode: httpStatus.OK,
      message:'students are retrieved successfully',
      data:result
    })
  } catch (error) {
    /* res.status(500).json({
      success: false,
      message: error.message || 'something went wrong',
      error: error,
    }); */
    next(error); //sending the error to global error handler on app.ts
  }
};

const getSingleStudent = async (req: Request, res: Response, next:NextFunction) => {
  try {
    //
    const { studentId } = req.params;
    //calling service
    const result = await StudentServices.getSingleStudentFormDB(studentId);
    //res
   /*  res.status(200).json({
      success: true,
      message: 'student is retrieved successfully',
      data: result,
    }); */
    sendResponse(res,{
      success:true,
      statusCode: httpStatus.OK,
      message:'student is retrieved successfully',
      data:result
    })
  } catch (error) {
    
    next(error)
  }
};

const deleteStudent = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentFromDB(studentId);
    /* res.status(200).json({
      success: true,
      message: 'Successfully deleted',
      data: result,
    }); */
    sendResponse(res,{
      success:true,
      statusCode: httpStatus.OK,
      message:'Successfully deleted',
      data:result
    })
  } catch (error) {
    
    next(error)
  }
};

export const StudentControllers = {
  getStudents,
  getSingleStudent,
  deleteStudent,
};
