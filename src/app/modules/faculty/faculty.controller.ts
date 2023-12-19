import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { facultyServices } from './faculty.service';

const getAllFaculty = catchAsync(async (req, res) => {
  console.log(req.cookies);
  const result = await facultyServices.getAllFacultyFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'faculty successfully fetched',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await facultyServices.getSingleFacultyFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single Faculty Successfully Fetched',
    data: result,
  });
});

const updateSingleFaculty = catchAsync(async (req, res) => {
  const {id} = req.params;
  const facultyData = req.body.faculty;
  const result = await facultyServices.updateSingleFacultyFromDB(
    id,
    facultyData,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single Faculty Successfully Updated',
    data: result,
  });
});


const deleteSingleFaculty = catchAsync(async(req,res)=>{
    const {id} = req.params;
  //  console.log(id);
    const result = await facultyServices.deleteSingleFacultyFromDB(id as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single Faculty Successfully Deleted',
        data: result,
      });
})





export const facultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty
};
