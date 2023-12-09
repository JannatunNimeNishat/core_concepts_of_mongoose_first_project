import { startSession } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQueryBuilder = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQueryBuilder.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  /*NOTE: preRequisiteCourse ar normal info ke alada kore fela hosce. 
// i.preRequisiteCourse er modde 2 ta kaj hobe. jodi input teka isDelete= false ase taile amader oi course ta ke preRequisiteCourse array te add korte hobe. r isDelete = true asle preRequisiteCourse array teka remove korte hobe.
// ii. courseRemainingData gula normal update er moto kore update hobe
*/
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  const session = await startSession();
  try {
    session.startTransaction();

    //step1: basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    //step 2 -> check if there is any pre preRequisiteCourses to update. if yes then pull them out from the preRequisiteCourses array
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //je field gula delete hobe se gula filter out kora hosce
      const deletedPreRequisites = preRequisiteCourses
        ?.filter((el) => el.course && el.isDeleted === true)
        .map((el) => el.course); // '65730955fcb1072d57d2e411'
      // console.log('deletedPreRequisites: ',deletedPreRequisites);
      const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {new: true,runValidators: true,session },
      );

      if (!deletedPreRequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete course');
      }

      //step 3 -> je incoming preRequisiteCourses ar  isDeleted = false ase oigula filter kore. preRequisiteCourses array ta add kore felte hobe.
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && el.isDeleted === false,
      );
      //console.log({newPreRequisites});
      const newPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            // addToSet sudu incoming changed fields gula update kore baki gula as it is rekha dey
            preRequisiteCourses: { $each: newPreRequisites },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisitesCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to add PreRequisitesCourses',
        );
      }

      const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
      ); // populate to see the updated preRequisiteCourses and normal data

      return result;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

// akta course er je je faculty nisce tader courseFaculty collection a add kora hosce 
const assignFacultiesWithCourseIntoDB = async (id: string, payload:Partial<TCourseFaculty>) => {
  const result = await CourseFaculty.findByIdAndUpdate(id,
    {
      course:id,
      $addToSet:{faculties:{$each:payload}} // duplicate faculty add korte dibe na. new faculty asle tobai add korbe
    },{
      upsert:true,
      new:true
    });
    return result;
};



//course teka assigned faculty ke delete kora hosce
const removeFacultiesFromCourseFromDB = async (id: string, payload:Partial<TCourseFaculty>) => {
  const result = await CourseFaculty.findByIdAndUpdate(id,
    {
      $pull:{faculties: {$in: payload}},
    },{
      new:true
    });
    return result;
};


export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
 assignFacultiesWithCourseIntoDB,
 removeFacultiesFromCourseFromDB
};
