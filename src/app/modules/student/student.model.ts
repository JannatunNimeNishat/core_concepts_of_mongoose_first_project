import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    trim: true, //it removes the space from start of the value and also remove from the last of the value. "  ni7  " to "ni7"
    maxlength: [20, 'first Name can not be greater then 20 character'],
    //custom validation
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    //validation with validator package
    type: String,
    required: [true, 'last name is required'],
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, 'father name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'fatherOccupation is required'],
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, 'fatherContactNo is required'],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, 'mother name is required'],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, 'motherOccupation is required'],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, 'motherContactNo is required'],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, trim: true, required: [true, 'name is required'] },
  occupation: {
    type: String,
    trim: true,
    required: [true, 'occupation name is required'],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, 'contactNo is required'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'address is required'],
  },
});

//2. creating student Schema
const studentSchema = new Schema<Student>({
  id: { type: String, required: true, unique: true },
  name: {
    type: userNameSchema,
    required: [true, 'name is required'],
  },
  gender: {
    //male or female as par student interface
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "'{VALUE}' is not valid. The gender field can only be one of the following: 'male', 'female' or 'other'",
    },
    required: [true, 'gender is required'],
  },
  dateOfBirth: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    required: [true, 'email is required'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, 'contactNo is required'],
  },
  emergencyContactNo: {
    type: String,
    trim: true,
    required: [true, 'emergencyContactNo is required'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: [
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
      message:
        "'{VALUE}' is not valid. The bloodGroup field can only be one of the following:'A' 'B' 'AB' 'O' 'A+' 'A-' 'B+' 'B-' 'AB+' 'AB-' 'O+' 'O-'",
    },
    required: true,
  },
  presentAddress: {
    type: String,
    trim: true,
    required: [true, 'presentAddress is required'],
  },
  permanentAddress: {
    type: String,
    trim: true,
    required: [true, 'permanentAddress is required'],
  },
  guardian: {
    type: guardianSchema,
    trim: true,
    required: [true, 'guardian is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    trim: true,
    required: [true, 'localGuardian is required'],
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
