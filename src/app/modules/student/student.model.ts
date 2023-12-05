import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';

const userNameSchema = new Schema<TUserName>({
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

const guardianSchema = new Schema<TGuardian>({
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

const localGuardianSchema = new Schema<TLocalGuardian>({
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
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId, //it will contain the reference id of user data
      required: [true, 'user id field is required'],
      unique: true,
      ref: 'User',
    },
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
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    dateOfBirth: { type: String },
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
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);



//virtual
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

//ii. Query middleware -> 'find'

//->pre find middleware/hook
//this pre middleware will effect before the current query get executed
studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } }); // gives all the documents except the deleted one. here isDeled === false
  next();
});

//-> findOne
studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } }); // gives only one document which here isDeled === false
  next();
});

//-> aggregate
studentSchema.pre('aggregate', async function (next) {
  //console.log(this.pipeline());
  // [{ $match: { isDeleted: { $ne: true } } }, { '$match': { id: '123452' } } ]
  //here we filter out the deleted fields
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//custom static method defination
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id: id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
