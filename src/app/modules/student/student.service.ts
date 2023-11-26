// import { TStudent } from './student.interface';
import { Student } from './student.model';



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
  getAllStudentsFromDB,
  getSingleStudentFormDB,
  deleteStudentFromDB,
};
