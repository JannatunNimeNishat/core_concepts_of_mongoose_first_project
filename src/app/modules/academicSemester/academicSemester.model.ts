import { Schema, model } from 'mongoose';
import { TAcademicSemester} from './academicSemester.interface';
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

//we are following DRY so we cut our constants and create a new file called academicSemester.constant.ts and past there so that we can use those const from validation and others if necessary

 const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName, // it is coming from academicSemester.constant
      required: true,
    },
    year: {
      type: String,
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


// aki year a aki nam e akadhik semester hote parbe na. mane Autumn 1ta particular year e aktai takbe 
academicSemesterSchema.pre('save', async function(next){
const isSemesterExists = await AcademicSemester.findOne({
  //amra je semester create korte casci sai semester aki year e already exists kore ki na. 
  year:this.year,//amader pathono year (this.name) already exist kore ki na
  name:this.name, // name database er name field etai amader pathono name (this.name) exist kore ki na
})
if(isSemesterExists){ // aki year e amader pathono nam e semester already ase, amra 2 bar aki nam e aki year e semester create korte dibo na. ti error throw kore disci jate create korte na pare
throw new AppError(httpStatus.NOT_FOUND,'Semester is already exists!');
}
  next();
})



export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);


//name year
//2023 Autumn => Created
//2030 Autumn => XXXXX 

//Autumn 01
//Summer 02
//Fall 03 

