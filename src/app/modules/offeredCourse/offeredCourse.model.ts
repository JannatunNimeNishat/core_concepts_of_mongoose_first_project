import { Schema, model } from "mongoose";
import { TOfferedCourse } from "./offeredCourse.interface";
import { Days } from "./offeredCourse.constant";

const offeredCourseSchema = new Schema<TOfferedCourse>({
    semesterRegistration:{
        type:Schema.Types.ObjectId,
        required:true,
        red:'SemesterRegistration'
    } ,
    academicSemester:{
        type:Schema.Types.ObjectId,
        required:true,
        red:'AcademicSemester'
    } ,
    academicFaculty:{
        type:Schema.Types.ObjectId,
        required:true,
        red:'AcademicFaculty'
    } ,
    academicDepartment:{
        type:Schema.Types.ObjectId,
        required:true,
        red:'AcademicDepartment'
    } ,
    course:{
        type:Schema.Types.ObjectId,
        required:true,
        red:'Course'
    } ,
    faculty:{
        type:Schema.Types.ObjectId,
        required:true,
        red:'Faculty'
    } ,
    maxCapacity:{
        type:Number,
        required:true,
       
    } ,
    section:{
        type:Number,
        required:true,
    } ,
    days:{
        type:String,
       enum:Days,
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
},{
    timestamps:true
})


export const OfferedCourse = model<TOfferedCourse>('OfferedCourse',offeredCourseSchema)