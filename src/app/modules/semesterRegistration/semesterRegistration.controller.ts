import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";
import { Request, Response } from "express";

const createSemesterRegistration = catchAsync(async(req:Request,res:Response)=>{
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'SemesterRegistration is created successfully',
        data: result,
      });
});


const getAllSemesterRegistration = catchAsync(async(req:Request,res:Response)=>{
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(req.query);
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: 'SemesterRegistration is retrieved successfully',
        data: result,
    })
});


const getSingleSemesterRegistration = catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single SemesterRegistration is retrieved successfully',
        data: result,
    })

})



export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration
}