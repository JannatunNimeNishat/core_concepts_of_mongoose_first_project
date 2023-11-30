import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';



const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'AcademicFaculty'
    }
  },
  {
    timestamps: true, //created and updatedAt will automatically created by mongoose
  },
);




export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema);
