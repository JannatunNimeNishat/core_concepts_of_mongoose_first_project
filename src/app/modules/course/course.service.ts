import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

const createCourseIntoDB = async (payload:TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query:Record<string,unknown>) => {
  const courseQueryBuilder = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'),query)
  .search(CourseSearchableFields)
  .filter()
  .sort()
  .paginate()
  .fields();
  const result = await courseQueryBuilder.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate('preRequisiteCourses.course');
  return result;
};
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(id,{isDeleted:true},{new:true});
  return result;
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB
};
