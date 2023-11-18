import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    //will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(studentData);

    //send response
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

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
