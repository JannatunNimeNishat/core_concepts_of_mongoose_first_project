import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
 

  if(academicSemesterNameCodeMapper[payload.name] !== payload.code){ 
    //1.academicSemesterNameCodeMapper[Autumn] = '01'
    //2. payload.code = '02'
    //3. '01' !== '02'
    
    throw new AppError(httpStatus.NOT_FOUND,'Invalid Semester Code');

  }

  const result = await AcademicSemester.create(payload);

  return result;
};


const getAllAcademicSemesterFromDB = async ()=>{
  const result = await AcademicSemester.find();
  return result;
}

const getSingleAcademicSemesterFromDB =async (payload:string) => {
  const result = await AcademicSemester.findOne({_id:payload});
  return result;
}

const updateAcademicSemesterIntoDB =async (semesterId:string,payload:Partial<TAcademicSemester>) => { // je je data dibe sudu saigula update hobe. sob data aksate deyar dorkar nia. 
  if(payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code){
    throw new AppError(httpStatus.NOT_FOUND,'invalid semester code');
  }
    const result = await AcademicSemester.findOneAndUpdate({_id:semesterId},payload,{new:true});
    return result;
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB
};
