import {RequestHandler} from 'express';// RequestHandler -> createStudent er req:Request, res:Response next:NextFunction er type auto declare kore dey
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status';

const getStudents:RequestHandler = async (req, res, next) => {
  try {
    //service
    const result = await StudentServices.getAllStudentsFromDB();
    
    sendResponse(res,{
      success:true,
      statusCode: httpStatus.OK,
      message:'students are retrieved successfully',
      data:result
    })
  } catch (error) {
    
    next(error); //sending the error to global error handler on app.ts
  }
};

const getSingleStudent:RequestHandler = async (req, res, next) => {
  try {
    //
    const { studentId } = req.params;
    //calling service
    const result = await StudentServices.getSingleStudentFormDB(studentId);
   
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

const deleteStudent:RequestHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentFromDB(studentId);
  
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
