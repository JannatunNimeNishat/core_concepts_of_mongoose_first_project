// import { TStudent } from './student.interface';
import { Student } from './student.model';

const getAllStudentsFromDB = async () => {
  // const result = await Student.find().populate('admissionSemester').populate('academicDepartment');
  const result = await Student.find()
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudentFormDB = async (id: string) => {
 const result = await Student.findById(id)
 .populate('user')
 .populate('admissionSemester')
 .populate({
  path:'academicDepartment',
  populate:{
    path:'academicFaculty'
  }
 })
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
