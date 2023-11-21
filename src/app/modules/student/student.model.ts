import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

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
// const studentSchema = new Schema<Student>({
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    //for static method
    // const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({ //for instance method
    id: { type: String, required: true, unique: true },
    name: {
      type: userNameSchema,
      required: [true, 'name is required'],
    },
    password: { type: String, required: [true, 'password field is required'] },
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
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

//middle ware

//i. Document middleware -> 'save'
//-> pre save middleware/hook
studentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  //console.log('pre: ', this);
  //we are hashing our password and save the hashed password to DB
  user.password = await bcrypt.hash(user.password, Number(config.saltRounds));
  next();
});

//-> post save middleware/hook
//this hook will work after the data has saved on the database.
studentSchema.post('save', function (doc, next) {
  // this will contain the saved data on database
  //console.log('post: ', this);
  doc.password = ''; // we don't want to send the password to the user even if it is hashed. we just emptied the password field from the saved data.
  next();
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

// custom instance method defination
/* studentSchema.methods.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id: id });
  return existingUser;
}; */

// 3. Create a Model.
// export const Student = model<TStudent>('Student', studentSchema);
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
