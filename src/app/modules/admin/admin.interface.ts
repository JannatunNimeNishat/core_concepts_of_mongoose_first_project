import { Types } from "mongoose"

export type TAname ={
    firstName:string;
    middleName?:string;
    lastName:string;
}

export type TGender = 'male' | 'female' | 'others';
export type TBloodGroup ='A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TAdmin = {
    id:string;
    user:Types.ObjectId;
    designation:string;
    name: TAname;
    gender:TGender;
    dateOfBirth:string;
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