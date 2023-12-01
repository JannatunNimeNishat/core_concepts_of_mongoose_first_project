// import { TStudent } from './student.interface';
import { startSession } from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

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

//transaction and rollback delete 
const deleteStudentFromDB = async (id: string) => {
  const session =await startSession();
  try {
    session.startTransaction();

    //->deleting student (transaction-1)

    //amra amader created kora id deya delete korte casci ti findOneAndUpdate use korte hobe. mongoose er _id deya korte cile amra findById korte partam
    const deletedStudent = await Student.findOneAndUpdate({id: id, },{isDeleted: true},{new: true, session});

    if(!deletedStudent){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    //-> deleting user (transaction-2)
    const deletedUser = await User.findOneAndUpdate({id:id},{isDeleted:true},{new:true, session})
    if(!deletedUser){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;


  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFormDB,
  deleteStudentFromDB,
};
