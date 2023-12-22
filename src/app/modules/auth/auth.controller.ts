import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  //setting the refreshToken to the browsers cookie.
  const { accessToken, refreshToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePasswordIntoDB(
    req.user,
    passwordData,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password updated Successfully',
    data: result,
  });
});

// refreshToken deya accessToken generate korar api
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'access token is retrieved successfully',
    data: result,
  });
});

//new  forget password
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.body.id;
  const result = await AuthServices.forgetPassword(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reset link is generated successfully',
    data: result,
  });
});

//reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(req.body,token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password is reset successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword 
};
