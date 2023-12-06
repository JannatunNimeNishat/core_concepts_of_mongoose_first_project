import { Schema, model } from 'mongoose';
import { TFaculty, TFacultyName } from './faculty.interface';
import { Gender, bloodGroup } from './faculty.constants';

const facultyNameSchema = new Schema<TFacultyName>({
  firstName: {
    type: String,
    required: [true, 'firstName is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'lastName is required'],
    maxlength: [20, 'lastName can not be more than 20 characters'],
  },
});

const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String, unique: true, required: [true, 'id is required'] },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: [true, 'user is required'],
    },
    designation: { type: String, required: [true, 'designation is required'] },
    name: { type: facultyNameSchema, required: [true, 'name is required'] },
    gender: {
      type: String,
      enum: { values: Gender, message: '{VALUE} is not a valid gender' },
      required: [true, 'name is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required'],
    },
    contactNo: { type: String, required: [true, 'contactNo is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'emergencyContactNo is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: bloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'presentAddress is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'permanentAddress is required'],
    },
    profileImg: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: [true, 'academicDepartment is required'],
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
facultySchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

facultySchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//-> aggregate
facultySchema.pre('aggregate', async function (next) {
  //console.log(this.pipeline());
  // [{ $match: { isDeleted: { $ne: true } } }, { '$match': { id: '123452' } } ]
  //here we filter out the deleted fields
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Faculty = model<TFaculty>('faculty', facultySchema);
