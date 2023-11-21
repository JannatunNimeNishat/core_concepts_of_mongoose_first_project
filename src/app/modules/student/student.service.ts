import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  //we are calling our custom static method
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('user already exists!');
  }

  //Here we r using mongoose builtin static method --> .create()
  const result = await Student.create(studentData);

  return result;

  //here we r using instance method
  //const newStudent = new Student(studentData);
  //calling the custom instance method that we have created
  /* if (await newStudent.isUserExists(studentData.id)) {
    throw new Error('user already exists!');
  }
  const result = await newStudent.save(); 
  return result;*/
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFormDB = async (id: string) => {
  const result = await Student.findOne({ id: id });
  //const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne(
    {
      id: id,
    },
    {
      isDeleted: true,
    },
    /*  {
      $set: {
        isDeleted: true,
      },
    }, */
  );
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFormDB,
  deleteStudentFromDB,
};
