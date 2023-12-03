import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true, //created and updatedAt will automatically created by mongoose
  },
);



// department already exist or not.
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartment.findOne({ name: this.name });
  if (isDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,'This Department with this name is Already Present in the Database',
    );
  }
  next();
});


//update validation-> checking the department is exists or not
academicDepartmentSchema.pre('findOneAndUpdate', async function(next){
    const query = this.getQuery(); // it will give us this { _id: '6568af70f8c58e42e73cda82' }
    const isDepartmentExists = await AcademicDepartment.findOne(query);
    
    if (!isDepartmentExists) {
        throw new AppError(httpStatus.NOT_FOUND ,'This Department does not exist in the Database'); // calling AppError with status code
      }
      next();
})


export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
