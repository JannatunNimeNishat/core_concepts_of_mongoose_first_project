/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import { handleZodError } from '../errors/handelZodError';

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

const globalErrorhandler: ErrorRequestHandler =  (error, req, res, next) => {

    // // default format  with default values
    let statusCode = error.statusCode  || 500;
    let message = error.message || 'Something went wrong';
    let errorSources:TErrorSource = [{
      path:'',
      message:'Something went wrong'
    }];


    //checking the incoming error is from zod or not 
    if(error instanceof ZodError){
     const simplifiedError = handleZodError(error);//handling the zod error. creating our common error format from default zod error

     //over writing the default format with our zod error format
     statusCode = simplifiedError?.statusCode;
      message=simplifiedError?.message;
      errorSources = simplifiedError?.errorSources;
    }

    //ultimate return
    return res.status(statusCode).json({
      success: false,
      message: message,
      errorSources,
      stack: config.NODE_ENV === 'development' ? error?.stack : null, // stack only send when it is development environment other wise null
    });
  }

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


