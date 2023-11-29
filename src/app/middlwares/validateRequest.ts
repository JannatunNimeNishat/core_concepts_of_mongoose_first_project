import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequest = (schema: AnyZodObject) => {//we can't pass parameter with middleware so we use a higher order function. So that we can pass parameter because we are validating data we need schema
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        //validation check
        //if data validation is ok then call next() and pass the control to controller
        await schema.parseAsync({
          body: req.body,
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  };

  export default validateRequest;