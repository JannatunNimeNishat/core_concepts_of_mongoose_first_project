import { Schema, model } from 'mongoose';

import { TAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //created and updatedAt will automatically created by mongoose
  },
);




export const AcademicFaculty = model<TAcademicFaculty>('academicFaculty', academicFacultySchema);
