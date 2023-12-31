import { Schema, model } from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>({
    academicSemester:{
        type:Schema.Types.ObjectId,
        ref:'AcademicSemester',
        unique:true,
        required:true,
        trim:true
    },
    status:{
        type:String,
        enum:SemesterRegistrationStatus,
        default:'UPCOMING',
        trim:true  
    },
    startDate:{
        type:Date,
        required:true,
        trim:true
    },
    endDate:{
        type:Date,
        required:true,
        trim:true
    },
    minCredit:{
        type:Number,
        default:3,
        trim:true
    },
    maxCredit:{
        type:Number,
        default:15,
        trim:true
    }
},{
    timestamps:true
});



export const SemesterRegistration = model<TSemesterRegistration>('SemesterRegistration', semesterRegistrationSchema);