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

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse
};
