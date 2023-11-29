import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

//1. creating Student interface
export type TStudent = {
  id: string;
  user:Types.ObjectId; //it will contain the reference id of user data
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  email: string;
  dateOfBirth?: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?:
    | 'A'
    | 'B'
    | 'AB'
    | 'O'
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester:Types.ObjectId,
  isDeleted: boolean;
};

//1. static method
export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

//2.instance method
//we are creating a custom instance method to check a user is already present on the database or not.
/* export type StudentMethods = {
  isUserExists(id: string): Promise<TStudent | null>; //function type
};
export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;
 */
