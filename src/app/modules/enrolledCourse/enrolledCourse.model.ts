import { Schema, model } from "mongoose";
import { TCourseMarks, TEnrolledCourse } from "./enrolledCourse.interface";
import { Grade } from "./enrolledCourse.Constant";

const courseMarksSchema = new Schema<TCourseMarks>({
    classTest1:{type:Number, default:0},
    midTerm:{type:Number, default:0},
    classTest2:{type:Number, default:0},
    finalTerm:{type:Number, default:0},
})




const enrolledCourseSchema = new Schema<TEnrolledCourse>({
    semesterRegistration:{type:Schema.ObjectId,required:true,ref:'SemesterRegistration'},
    academicSemester:{type:Schema.ObjectId,required:true,ref:'AcademicSemester' },
    academicFaculty:{type:Schema.ObjectId,required:true,ref:'AcademicFaculty' },
    academicDepartment:{type:Schema.ObjectId,required:true,ref:'AcademicDepartment' },
    offeredCourse:{type:Schema.ObjectId,required:true,ref:'OfferedCourse' },
    course:{type:Schema.ObjectId,required:true,ref:'Course' },
    student:{type:Schema.ObjectId,required:true,ref:'Student' },
    faculty:{type:Schema.ObjectId,required:true,ref:'Faculty' },
    isEnrolled:{type:Boolean,required:true, default:false},
    courseMarks:{type:courseMarksSchema},
    grade:{type:String,enum:Grade,default:'NA' , required:true},
    gradePoints:{type:Number,min:0,max:4, required:true},
    isCompleted:{type:Boolean,required:true},
});

export const EnrolledCourse = model<TEnrolledCourse>('EnrollCourses', enrolledCourseSchema);
