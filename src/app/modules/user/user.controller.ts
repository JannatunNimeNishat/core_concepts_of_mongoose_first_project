// import studentValidationSchema from './student.validation';

import {  RequestHandler} from "express"; // RequestHandler -> createStudent er req:Request, res:Response next:NextFunction er type auto declare kore dey
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";

import httpStatus from 'http-status';

const createStudent:RequestHandler = async (req, res, next) => { // RequestHandler -> createStudent er req:Request, res:Response next:NextFunction er type auto declare kore dey
    try {
      const {password, student: studentData } = req.body;
  
      //validating the received data with Zod
      //const zodParsedData = studentValidationSchema.parse(studentData);
  
      //will call service func to send this data
      const result = await UserServices.createStudentIntoDB(password, studentData);
  
      //send response
     /*  res.status(200).json({
        success: true,
        message: 'student is created successfully',
        data: result,
      }); */
      
      //handling response by using utility sendResponse function
      sendResponse(res,{
      success:true,
      statusCode: httpStatus.OK,
      message:'Student is created successfully',
      data:result
    })
    
    } catch (error) {

      next(error);
    }
  };


 export const UserControllers = {
  createStudent
 }