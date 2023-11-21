import { Request, Response } from 'express';
import { StudentServices } from './student.service';

// Joi
//import studentValidationJoiSchema from './student.validation';

import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    //validating the received data with Zod
    const zodParsedData = studentValidationSchema.parse(studentData);

    //will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(zodParsedData);

    //send response
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'something went wrong',
      error: error,
    });
  }
};

// validation with Joi
/* const createStudent = async (req: Request, res: Response) => {
  try {
   
    const { student: studentData } = req.body;

    //validating the studentJoiSchema with the received data
    const { value, error } = studentValidationJoiSchema.validate(studentData);

   

    if (error) {
      res.status(500).json({
        success: false,
        message: 'something went wrong',
        error:error.details,
      });
    }
    //will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(value);

    //send response
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something went wrong',
      error: error,
    });
  }
}; */

const getStudents = async (req: Request, res: Response) => {
  try {
    //service
    const result = await StudentServices.getAllStudentsFromDB();
    //res
    res.status(400).json({
      success: true,
      message: 'students are retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    //
    const { studentId } = req.params;
    //calling service
    const result = await StudentServices.getSingleStudentFormDB(studentId);
    //res
    res.status(200).json({
      success: true,
      message: 'student is retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  getStudents,
  getSingleStudent,
};
