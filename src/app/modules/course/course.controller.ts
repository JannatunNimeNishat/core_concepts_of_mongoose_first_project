import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { courseServices } from './course.service';
import catchAsync from '../../utils/catchAsync';

const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Courses are found successfully!',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Course are found successfully',
    data: result,
  });
});


const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await  courseServices.updateCourseIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course is updated successfully!',
    data: result,
  });
});


const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course is deleted successfully!',
    data: result,
  });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body;
  const result = await courseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties assigned successfully to the course!',
    data: result,
  });
});

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body;
  const result = await courseServices.removeFacultiesFromCourseFromDB(courseId, faculties);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties removed successfully to the course!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse
};
