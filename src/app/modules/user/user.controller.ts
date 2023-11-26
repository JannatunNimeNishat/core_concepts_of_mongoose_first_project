// import studentValidationSchema from './student.validation';

import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";


const createStudent = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const {password, student: studentData } = req.body;
  
      //validating the received data with Zod
      //const zodParsedData = studentValidationSchema.parse(studentData);
  
      //will call service func to send this data
      const result = await UserServices.createStudentIntoDB(password, studentData);
  
      //send response
      res.status(200).json({
        success: true,
        message: 'student is created successfully',
        data: result,
      });
    } catch (error) {

      next(error);
    }
  };


 export const UserControllers = {
  createStudent
 }