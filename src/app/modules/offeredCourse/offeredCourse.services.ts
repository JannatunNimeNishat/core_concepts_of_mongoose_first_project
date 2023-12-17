import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferCourseIntoDB = async (payload: TOfferedCourse) => {
  //check 1: checking the incoming reference _ids are exists or not
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);
  if(!isSemesterRegistrationExists){
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }

  //check 1.1: getting the academicSemester from SemesterRegistration
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

  //check 2: check if the department we are sending in input actually belong to the faculty we are also sending in input
  /** amra input e je academic department ta disci oita ki amader deya academic faculty r under e ki na.  */
  const isAcademicDepartmentBelongToTheAcademicFaculty = await AcademicDepartment.findOne({
    _id:academicDepartment,
    academicFaculty:academicFaculty
  });

  if(!isAcademicDepartmentBelongToTheAcademicFaculty){
    throw new AppError(httpStatus.BAD_REQUEST,`This ${isAcademicDepartmentExists?.name} is not belong to the ${isAcademicFacultyExists?.name}`);
  }


  //check 3: check if the same offeredCourse same section in same registered exists

   const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
   await OfferedCourse.findOne({
     semesterRegistration,
     course,
     section,
   });

 if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
   throw new AppError(
     httpStatus.BAD_REQUEST,
     `Offered course with same section is already exist!`,
   );
 }


 //check 4: aki time a aki sate 2 ta section e kono faculty/teacher class nite parbe na.
 /**4.1: je faculty,(semesterRegistration,days) input e asteca, tar schedule mane, offeredCourse collection e oi faculty r agar assign kora days, startTime, endTime neya asteci */
 const assignedSchedules = await OfferedCourse.find({
    semesterRegistration:semesterRegistration,
    faculty:faculty,
    days:{$in:days}
 }).select('days startTime endTime');
//console.log(assignedSchedules);

//input e je days, startTime, endTime asteca saita neya newSchedule object create hosce
 const newSchedule = {
    days:days,//input teka asha days
    startTime:startTime, // input teka asha startTime
    endTime:endTime, // input teka asha endTime
 }

 //checking is there any conflict

 if(hasTimeConflict(assignedSchedules,newSchedule)){
    throw new AppError(
        httpStatus.CONFLICT,
        `This faculty is not available at that time! Choose other time or day`,
      );
 }

 /** eta ke offeredCourse.utils file e neya joa hoyce 
 //check kore hosce faculty/teacher er  ager neya courser er time (days, startTime,endTime) er sate acon new je course er time ta astece saita conflict hoye jasce ki na.
assignedSchedules.forEach((schedule)=>{
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`); // agar startTime
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`); // ager endTime
    const newStartTime = new Date(`1970-01-01T${newSchedule?.startTime}`); // input teka asha startTime
    const newEndTime = new Date(`1970-01-01T${newSchedule?.endTime}`); // input teka asha endTime
    //checking kora hosce aki time a conflict kore ki na.
    //10:30 - 12:30
    //9:30 - 1:30
    if(newStartTime < existingEndTime && newEndTime > existingStartTime){
        throw new AppError(
            httpStatus.CONFLICT,
            `This faculty is not available at that time! Choose other time or day`,
          );
    }
});
*/


  const result = await OfferedCourse.create({...payload,academicSemester});
  return result;
  //return null;
};


const updateOfferCourseIntoDB = async (id:string, payload:Pick<TOfferedCourse, 'faculty'|'days'|'startTime'|'endTime'>) =>{
    const {faculty,days, startTime,endTime} = payload;
    // check 1: offeredCourse jeta update kortecasci saita exists kore ki na
    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if(!isOfferedCourseExists){
      throw new AppError(httpStatus.NOT_FOUND, 'OfferedCourse not found');
    }

    //check 2: semesterRegistration jeita input e asteca oitar status jodi UPCOMING take tokon e sudhu update korte dibo. ONGOIN ba ENDED status hole dibo na
    
    const semesterRegistrationId = isOfferedCourseExists?.semesterRegistration;
    const SemesterRegistrationStatus = await SemesterRegistration.findById(semesterRegistrationId);
    if(SemesterRegistrationStatus?.status !== 'UPCOMING'){
        throw new AppError(httpStatus.BAD_REQUEST, `You can not update this offered course as it is ${SemesterRegistrationStatus?.status}`);
    }



    // check 3: incoming faculty jeita asbe oita Faculty collection a exists kore ki na. faculty na amon kauke amra db te rakbo na.
   
    const isFacultyExists = await Faculty.findById(faculty); // faculty ObjectId -> _id
    if(!isFacultyExists){
        throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
      }

    //check 4: je time and days asbe oigula age teka assign kora kono time days sate conflict kore ki na saita check korte hobe amader utils e rakha hasTimeConflict function deya. 

      const semesterRegistration = isOfferedCourseExists?.semesterRegistration;

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration:semesterRegistration,
        faculty:faculty,
        days:{$in:days}
     }).select('days startTime endTime');

    
    //input e je days, startTime, endTime asteca saita neya newSchedule object create hosce
     const newSchedule = {
        days:days,//input teka asha days
        startTime:startTime, // input teka asha startTime
        endTime:endTime, // input teka asha endTime
     }

      //checking is there any conflict

 if(hasTimeConflict(assignedSchedules,newSchedule)){
    throw new AppError(
        httpStatus.CONFLICT,
        `This faculty is not available at that time! Choose other time or day`,
      );
 }

 const result = await OfferedCourse.findByIdAndUpdate(id,payload, {new:true});
 return result;

    

}

export const OfferedCourseServices = {
  createOfferCourseIntoDB,
  updateOfferCourseIntoDB
};
