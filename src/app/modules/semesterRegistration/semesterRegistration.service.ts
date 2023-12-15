import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";

const createSemesterRegistrationIntoDB = async(payload:TSemesterRegistration)=>{

    const academicSemester = payload?.academicSemester;

    //check 1-> if the academicSemester is exist on  academicSemester model
    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester); // objectId -> _id asbe ti direct likha jasce
    
    if(!isAcademicSemesterExists){
        throw new AppError(httpStatus.NOT_FOUND,'This academic semester not found!')
    }



    const isSemesterRegistrationExists = await SemesterRegistration.findOne({academicSemester});

     //check 2-> if the semester is already registered . semesterRegistration age hoyce ki na. hoyle r register kora jabe na. 
     if(isSemesterRegistrationExists){
        throw new AppError(httpStatus.CONFLICT,'This semester is already registered');
     }


     const result = await SemesterRegistration.create(payload);
     return result;

    

}




export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB
}