import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createOfferCourse = catchAsync(async(req:Request,res:Response)=>{
    const result = await OfferedCourseServices.createOfferCourseIntoDB(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Offered Course is created successfully',
        data:result
    })
});

const updateOfferCourse = catchAsync(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await OfferedCourseServices.updateOfferCourseIntoDB(id,req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Offered Course is updated successfully',
        data:result
    })
});


const getAllOfferedCourse = catchAsync(async(req:Request,res:Response)=>{
    
    const result = await OfferedCourseServices.getAllOfferedCourseFromDB();
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Offered Courses retrieved successfully',
        data:result
    })
});







export const OfferedCourseControllers = {
    createOfferCourse,
    updateOfferCourse,
    getAllOfferedCourse
}