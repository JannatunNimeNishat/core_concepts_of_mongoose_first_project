/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import {
  TEnrolledCourse,
  TEnrolledCourseMarks,
} from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

/** steps for createEnrollCourse
 * step 1: incoming offeredCourse exists kore ki na.
 * step 2: class er capacity full ki na saita check korte hobe. maxCapacity <=0
 * step 3: akta student jate aki course e akadik bar enroll korte na pare
 * step 4: check if the max credit exceed. je semesterRegistration colteca tar max credit exceed hoa jabe na
 * step 4.1: akta student ai offeredSemester e kun kun course e enroll korteca saita ber kore, oi course gular total credit koto seta ber kora hosce lookup and group deya.
 * step 4.2: acan amara je course e enroll korte cai tar credit r agar enroll kora course gular credit jog kore jodi oi semester er max credit teka bashi hoye jai tahole amra error deya bolbo max credit reached.
 * step 5: sob tik takle create an enrolled Course
 * step 6: student enroll kore fella token amdaer maxCapacity -1 korte hobe. karon akta student enroll kore felce so capacity o 1 kome gase.
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

  // 4: check if the max credit exceed
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists?.semesterRegistration,
  ).select('maxCredit');

  const currentSemestersMaxCredit = semesterRegistration?.maxCredit;

  // akta student ai offeredSemester e kun kun course e enroll korteca saita ber kore, oi course gular total credit koto seta ber kora hosce lookup and group deya.
  const enrolledCoursesTotalCredit = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credit' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalCredits =
    enrolledCoursesTotalCredit.length > 0
      ? enrolledCoursesTotalCredit[0]?.totalEnrolledCredits
      : 0;

  //agar enroll kora course gular total credit r acon je course e enroll korte casce ei 2 ta add kore jodi oi semester er max credit er ceya boro hoa jabe na.

  //getting the current course
  const currentCourse = await Course.findById(isOfferedCourseExists?.course);
  const currentCourseCredit = currentCourse?.credit;

  //total enrolled credits + new enrolled course credit > maxCredit
  if (
    totalCredits &&
    currentSemestersMaxCredit &&
    totalCredits + currentCourseCredit > currentSemestersMaxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits',
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

    //6: student enroll kore fella token amdaer maxCapacity -1 korte hobe. karon akta student enroll kore felce so capacity o 1 kome gase.

    //enroll korar agar maxCapacity
    const maxCapacity = isOfferedCourseExists?.maxCapacity;
    //updating the maxCapacity of just created enrolledCourse
    await OfferedCourse.findByIdAndUpdate(payload?.offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

/**steps for updateEnrolledCourseMarksIntoDB
 * step 1: validations
 * step 2: token e je faculty astece she oi course nisce ki na. je course ta nibe sai sudu marks update korte parbe. so checking the incoming faculty is taking the course or not
 * step 3:
 *
 *
 */

//update the course marks
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  //validations
  const isSemesterRegistration =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'semesterRegistration is not found',
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'OfferedCourse is not found');
  }

  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'student is not found');
  }

  //2. token e je faculty astece she oi course nisce ki na. je course ta nibe sai sudu marks update korte parbe. so checking the incoming faculty is taking the course or not

  const facultyObjectId = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!facultyObjectId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found');
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: facultyObjectId,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
  }

  //3. update
  //3.1 finalTerm input e asle grade, gradePoint, isCompleted add kore felte hobe
  //3.2 dynamic update

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

  const result =   calculateGradeAndPoints(totalMarks)
  modifiedData.grade = result.grade;
  modifiedData.gradePoints = result.gradePoints;
  modifiedData.isCompleted = true;

  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

export const EnrollCoursesService = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
