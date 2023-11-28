import { NextFunction, Request, RequestHandler, Response } from 'express'; // RequestHandler -> createStudent er req:Request, res:Response next:NextFunction er type auto declare kore dey

//avoid the try catch my using higher order function catchAsync
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // if the promise is not resolved we are sending the errors to our global error handler function
  };
};



export default catchAsync;
