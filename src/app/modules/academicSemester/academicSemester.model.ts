import { Schema, model } from 'mongoose';
import { TAcademicSemester} from './academicSemester.interface';
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constant';

//we are following DRY so we cut our constants and create a new file called academicSemester.constant.ts and past there so that we can use those const from validation and others if necessary

export const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName, // it is coming from academicSemester.constant
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      enum:AcademicSemesterCode,// it is coming from academicSemester.constant
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,// it is coming from academicSemester.constant
      required:true
    },
    endMonth: {
      type: String,
      enum: Months,// it is coming from academicSemester.constant
      required:true
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicSemester = model<TAcademicSemester>(
  'academicSemester',
  academicSemesterSchema,
);
