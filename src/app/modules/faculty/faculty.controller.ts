import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { facultyServices } from "./faculty.service";

const getAllFaculty = catchAsync(async (req,res)=>{
    const result = await facultyServices.getAllFacultyFromDB(req.query);
    console.log(result);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'faculty successfully fetched',
        data:result
    })
})




export const facultyControllers = {
    getAllFaculty
}