import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';

const createOfferCourseIntoDB = async (payload: TOfferedCourse) => {
  //check 1: checking the incoming reference _ids are exists or not
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
  if(!isSemesterRegistrationExists){
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }

  //getting the academicSemester from SemesterRegistration
  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists = await AcademicFaculty.findById(academicFaculty);
  if(!isAcademicFacultyExists){
    throw new AppError(httpStatus.NOT_FOUND, 'AcademicFaculty not found');
  }
  const isAcademicDepartmentExists = await AcademicDepartment.findById(academicDepartment);
  if(!isAcademicDepartmentExists){
    throw new AppError(httpStatus.NOT_FOUND, 'AcademicDepartment not found');
  }

  const isCourseExists = await Course.findById(course);
  if(!isCourseExists){
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const isFacultyExists = await Faculty.findById(faculty);
  if(!isFacultyExists){
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const result = await OfferedCourse.create({...payload,academicSemester});
  return result;
};

export const OfferedCourseServices = {
  createOfferCourseIntoDB,
};
