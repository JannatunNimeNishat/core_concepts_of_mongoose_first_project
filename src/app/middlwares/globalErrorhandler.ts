/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import { handleZodError } from '../errors/handelZodError';
import handleValidationError from '../errors/handleValidatoinError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

/** Common error pattern
 *
 * success
 * message
 * errorSources: [
 * {
 *  path:'',
 *  message:''
 * },
 * ],
 * stack:
 *
 */

const globalErrorhandler: ErrorRequestHandler = (error, req, res, next) => {
  // // default format  with default values
  let statusCode =  500;
  let message =  'Something went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  //error gula kotha teka asteca saita check kore. oi error er handler er sate pathano hosce
  if (error instanceof ZodError) {//checking the incoming error is from zod or not
    const simplifiedError = handleZodError(error); //handling the zod error. creating our common error format from default zod error

    //over writing the default format with our created common error format
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === 'ValidationError') {
    // checking the error is coming from mongoose validation error
    const simplifiedError = handleValidationError(error); //handling the mongoose validation error. creating our common error format from default mongoose validation error

    //over writing the default format with our created common error format
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === 'CastError') { //this error occurs When input value which we are sending doesn't match the specified data type in the schema.
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.code === 11000) {//this error occurs When there is duplicate input is coming from input but the specified field in the schema is an index or we can say that unique:true.
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error instanceof AppError) {// amader banano AppError class er error kao amader moto format korteci

    statusCode = error?.statusCode;
    message = error?.message;
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ];
  }else if (error instanceof Error) {// builtin Error class er error kao amader moto format korteci

  
    message = error?.message;
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
   // error, //to see the full error
    stack: config.NODE_ENV === 'development' ? error?.stack : null, // stack only send when it is development environment other wise null
  });
};

export default globalErrorhandler;

/** Common error pattern
 *
 * success
 * message
 * errorSources: [
 * {
 *  path:'',
 *  message:''
 * },
 * ],
 * stack:
 *
 */
