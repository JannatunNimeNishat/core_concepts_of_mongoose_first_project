import { startSession } from 'mongoose';
import config from '../../config';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user
  // const user: NewUser = {};
  const userData: Partial<TUser> = {}; // partial makes it optional

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  //newly added email field for forget reset password
  userData.email = payload?.email;

  //finding academic semester info
  //we are finding the academicSemester info with the help of reference property called admissionSemester saved in Student model. so that we can use the semester year and code for creating studentId
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  /**implementing transaction and rollback */
  //s1 -> create session
  const session = await startSession();
  try {
    //s2 -> start session
    session.startTransaction();

    if (admissionSemester) {
      // otherwise it generate error warning
      //set  generated id
      userData.id = await generateStudentId(admissionSemester);
    }

    //s3 -> create a user (transaction-1)
    const newUser = await User.create([userData], { session });
    // const newUser = await User.create(userData);

    //s4 -> if the user is not created that means transaction is not successful.
    if (!newUser.length) {
      // because now we are getting an array
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //set id, _id as user
    payload.id = newUser[0].id; // embedding id
    payload.user = newUser[0]._id; // reference _id

    //s5 -> create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    // const newStudent = await Student.create(payload);

    //s6 ->if the student is not created that means transaction is not successful.
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    //s7 -> if all good.
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error: any) {
    //s8 -> is anything goes wrong. abort Transaction and end session
    await session.abortTransaction();
    await session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    throw new Error(error);
  }

  //return newUser;
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'faculty';
  //newly added email field for forget reset password
  userData.email = payload?.email;

  const session = await startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id;
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error:any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error)
  }
};

const createAdminIntoDB = async(password:string, payload:TAdmin)=>{
  const userData:Partial<TUser> = {};
  userData.password = password || (config.default_password);
  userData.role = 'admin';
  //newly added email field for forget reset password
  userData.email = payload?.email;
  const session = await startSession();
  try {
    session.startTransaction()
    userData.id = await generateAdminId();
    const newUser = await User.create([userData],{session});
    if(!newUser.length){
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create user');
    }
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id
    const newAdmin = await Admin.create([payload],{session})
    if(!newAdmin.length){
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create admin');
    }
   await session.commitTransaction();
   await session.endSession()
    return newAdmin
  } catch (error:any) {
   await session.abortTransaction()
   await session.endSession();
    throw new Error(error);
  }

}

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
