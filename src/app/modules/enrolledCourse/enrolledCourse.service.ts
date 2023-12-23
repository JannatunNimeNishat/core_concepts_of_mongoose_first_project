/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';

/** steps for createEnrollCourse
 * step 1: incoming offeredCourse exists kore ki na.
 * step 2: class er capacity full ki na saita check korte hobe. maxCapacity <=0
 * step 3: akta student jate aki course e akadik bar enroll korte na pare
 * step 4: sob tik takle create an enrolled Course
 * step 5: student enroll kore fella token amdaer maxCapacity -1 korte hobe. karon akta student enroll kore felce so capacity o 1 kome gase.
 *
 */
const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  //getting the offeredCourse from payload
  const { offeredCourse } = payload;
  //1.checking is incoming offeredCourse is exists or not
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
 
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'OfferedCourse not found');
  }

  //2. maxCapacity checking, akta class e student enroll korar limit takbe maxCapacity <=0 hoye gela r enroll korte deya jabe na.
  if (isOfferedCourseExists?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full');
  }

  //3.checking is this student already enrolled in this  offeredCourse

  //payload e amader custom id astece, but amra EnrolledCourse er student field e ObjectId save korteci.Ti amader payload er custom id deya student model e findOne kore oi student er _id ta ber kore ante hobe and then amra isThisStudentEnrolledInThisOfferedCourse e oi _id ta deya findOne kore dekbo already enroll koreca ki na.

//   const student = await Student.findOne({ id: userId });
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'student not found');
  }

  const isThisStudentEnrolledInThisOfferedCourse = await EnrolledCourse.findOne(
    {
      semesterRegistration: isOfferedCourseExists?.semesterRegistration,
      offeredCourse: payload?.offeredCourse,
      student: student._id,
    },
  );

  if (isThisStudentEnrolledInThisOfferedCourse) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Already enrolled in this offeredCourse',
    );
  }

  //transaction rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //5. create a EnrollCourse
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists?.semesterRegistration,
          academicSemester: isOfferedCourseExists?.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: payload?.offeredCourse,
          course: isOfferedCourseExists?.course,
          student: student?._id,
          faculty: isOfferedCourseExists?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    //jodi kuno karone create na korte pare tokon error throw korbe
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in this Course',
      );
    }

    //5: student enroll kore fella token amdaer maxCapacity -1 korte hobe. karon akta student enroll kore felce so capacity o 1 kome gase.

    //enroll korar agar maxCapacity
    const maxCapacity = isOfferedCourseExists?.maxCapacity;
    //updating the maxCapacity of just created enrolledCourse
    await OfferedCourse.findByIdAndUpdate(payload?.offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error:any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const EnrollCoursesService = {
  createEnrolledCourseIntoDB,
};
