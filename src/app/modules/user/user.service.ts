import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { NewUser, TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //create a user
  // const user: NewUser = {};
  const userData: Partial<TUser> = {}; // partial makes it optional

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  //set manually generated id
  userData.id = '2030100001';

  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    
    //set id, _id as user
    studentData.id = newUser.id; // embedding id
    studentData.user = newUser._id; // reference _id

    const newStudent = await Student.create(studentData);
    return newStudent;
    
  }

  //return newUser;
};

export const UserServices = {
  createStudentIntoDB,
};
