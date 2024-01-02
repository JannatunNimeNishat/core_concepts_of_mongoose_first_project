import { Schema, model } from 'mongoose';
import {
  TEnrolledCourseMarks,
  TEnrolledCourse,
} from './enrolledCourse.interface';
import { Grade } from './enrolledCourse.Constant';

const courseMarksSchema = new Schema<TEnrolledCourseMarks>(
  {
    classTest1: { type: Number, min: 0, max: 10, default: 0 },
    midTerm: { type: Number, min: 0, max: 30, default: 0 },
    classTest2: { type: Number, min: 0, max: 10, default: 0 },
    finalTerm: { type: Number, min: 0, max: 50, default: 0 },
  },
  {
    _id: false,
  },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.ObjectId,
    required: true,
    ref: 'SemesterRegistration',
    trim:true
  },
  academicSemester: {
    type: Schema.ObjectId,
    required: true,
    ref: 'AcademicSemester',
    trim:true
  },
  academicFaculty: {
    type: Schema.ObjectId,
    required: true,
    ref: 'AcademicFaculty',
    trim:true
  },
  academicDepartment: {
    type: Schema.ObjectId,
    required: true,
    ref: 'AcademicDepartment',
    trim:true
  },
  offeredCourse: {
    type: Schema.ObjectId,
    required: true,
    ref: 'OfferedCourse',
    trim:true
  },
  course: { type: Schema.ObjectId, required: true, ref: 'Course',trim:true },
  student: { type: Schema.ObjectId, required: true, ref: 'Student',trim:true },
  faculty: { type: Schema.ObjectId, required: true, ref: 'Faculty',trim:true },
  isEnrolled: { type: Boolean, required: true, default: false },
  courseMarks: { type: courseMarksSchema, default: {} },
  grade: { type: String, enum: Grade, default: 'NA' },
  gradePoints: { type: Number, min: 0, max: 4, default: 0 },
  isCompleted: { type: Boolean, default: false },
});

export const EnrolledCourse = model<TEnrolledCourse>(
  'EnrollCourses',
  enrolledCourseSchema,
);
