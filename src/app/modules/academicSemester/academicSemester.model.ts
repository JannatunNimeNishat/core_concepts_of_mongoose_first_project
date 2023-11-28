import { Schema, model } from 'mongoose';
import { TAcademicSemester, TMonths } from './academicSemester.interface';

const months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    /*  id: {
    type: String,
    enum: ['Autumn','Summer','Fall'],
    required: [true, 'id field is required'],
  }, */
    name: {
      type: String,
      // enum: ['01', '02','03'],
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: months,
    },
    endMonth: {
      type: String,
      enum: months,
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
