import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { facultyServices } from "./faculty.service";

const getAllFaculty = catchAsync(async (req,res)=>{
    const result = await facultyServices.getAllFacultyFromDB(req.query);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'faculty successfully fetched',
        data:result
    })
})

const getSingleFaculty = catchAsync(async(req,res)=>{
    const facultyId = req.params.facultyId;
    const result = await facultyServices.getSingleFacultyFromDB(facultyId);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Single Faculty Successfully Fetched',
        data:result,
    })
})



export const facultyControllers = {
    getAllFaculty,
    getSingleFaculty
}