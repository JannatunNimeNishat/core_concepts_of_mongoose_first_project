import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrollCoursesService } from "./enrolledCourse.service";

/**token debug kore userId r req.body r modde data (offeredCourse) input e pathano hosce */
const createEnrolledCourse = catchAsync(async(req,res)=>{
    const {userId} = req.user;
    const result = await EnrollCoursesService.createEnrolledCourseIntoDB(userId,req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student is enrolled successfully',
        data:result
    })
})


const updateEnrolledCourseMarks = catchAsync(async(req,res)=>{
    const facultyId = req.user.userId;
    
    const result = await EnrollCoursesService.updateEnrolledCourseMarksIntoDB(facultyId,req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Marks is updated successfully',
        data:result
    })
})

export const EnrollCoursesController = {
    createEnrolledCourse,
    updateEnrolledCourseMarks
}