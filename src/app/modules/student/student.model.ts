import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: [true,'first name is required'] },
  middleName: { type: String },
  lastName: { type: String, required: [true,'last name is required'] },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: [true,'father name is required'] },
  fatherOccupation: { type: String, required: [true,'fatherOccupation is required'] },
  fatherContactNo: { type: String, required: [true,'fatherContactNo is required'] },
  motherName: { type: String, required: [true,'mother name is required'] },
  motherOccupation: { type: String, required: [true,'motherOccupation is required'] },
  motherContactNo: { type: String, required: [true,'motherContactNo is required'] },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: [true,'name is required'] },
  occupation: { type: String, required: [true,'occupation name is required'] },
  contactNo: { type: String, required: [true,'contactNo is required'] },
  address: { type: String, required: [true,'address is required'] },
});

//2. creating student Schema
const studentSchema = new Schema<Student>({
  id: { type: String },
  name: {
    type: userNameSchema,
    required: [true,'name is required'],
  },
  gender: {
    //male or female as par student interface
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true,'gender is required'],
  },
  dateOfBirth: { type: String },
  email: { type: String, required: [true,'email is required'] },
  contactNo: { type: String, required: [true,'contactNo is required'] },
  emergencyContactNo: { type: String, required: [true,'emergencyContactNo is required'] },
  bloodGroup: {
    type: String,
    enum: [
      'A',
      'B',
      'AB',
      'O',
      'A+',
      'A-',
      'B+',
      'B-',
      'AB+',
      'AB-',
      'O+',
      'O-',
    ],
    required: true,
  },
  presentAddress: { type: String, required: [true,'presentAddress is required'] },
  permanentAddress: { type: String, required: [true,'permanentAddress is required'] },
  guardian: {
    type: guardianSchema,
    required: [true,'guardian is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true,'localGuardian is required'],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
});

// 3. Create a Model.
export const StudentModel = model<Student>('Student', studentSchema);
