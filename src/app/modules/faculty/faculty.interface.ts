import { Types } from "mongoose";


export type TGender = 'male'| 'female'| 'others'
export type TFacultyName ={
    firstName:string;
    middleName?:string;
    lastName:string;
}
export type TBloodGroup ='A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type TFaculty = {
    id:string;
    user:Types.ObjectId;
    designation:string;
    name:TFacultyName;
    gender:TGender;
    dateOfBirth?:string;
    email:string;
    contactNo:string;
    emergencyContactNo:string;
    bloodGroup?: TBloodGroup;
    presentAddress:string;
    permanentAddress:string;
    profileImg?:string;
    academicDepartment: Types.ObjectId;
    isDeleted:boolean;
}