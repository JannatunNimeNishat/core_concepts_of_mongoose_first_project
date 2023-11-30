import config from '../../config';

import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user
  // const user: NewUser = {};
  const userData: Partial<TUser> = {}; // partial makes it optional

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';



  //finding academic semester info
  //we are finding the academicSemester info with the help of reference property called admissionSemester saved in Student model. so that we can use the semester year and code for creating studentId 
  const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

if(admissionSemester){ // otherwise it generate error warning
  //set  generated id
  userData.id = await generateStudentId(admissionSemester);
}

  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    
    //set id, _id as user
    payload.id = newUser.id; // embedding id
    payload.user = newUser._id; // reference _id

    const newStudent = await Student.create(payload);
    return newStudent;
    
  }

  //return newUser;
};

export const UserServices = {
  createStudentIntoDB,
};
