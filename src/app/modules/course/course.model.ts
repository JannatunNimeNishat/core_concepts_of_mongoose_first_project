import {  Schema, model } from "mongoose";
import { TCourse, TPreRequisiteCourses } from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
    course:{type:Schema.ObjectId, ref:'Course'},
    isDeleted:{type:Boolean, default:false}
})

const courseSchema = new Schema<TCourse>({
    title:{type:String,unique:true, trim:true, required:true},
    prefix:{type:String,trim:true, required:true},
    code:{type:Number,trim:true, required:true},
    credit:{type:Number,trim:true, required:true},
    isDeleted:{type:Boolean, default:false},
    preRequisiteCourses:[preRequisiteCoursesSchema],
})

export const Course = model<TCourse>('Course',courseSchema);