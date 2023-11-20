import { Student } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDB = async (studentData: Student) => {
  /*
  *Here we r using mongoose static method --> .create()
  const result = await StudentModel.create(studentData);
  return result; */

  //here we r using instance method
  const newStudent = new StudentModel(studentData);
  const result = await newStudent.save();
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};

const getSingleStudentFormDB = async (id: string) => {
  const result = await StudentModel.findOne({ id: id });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFormDB,
};
