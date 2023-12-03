import { ZodError, ZodIssue } from "zod";
import { TErrorSource } from "../interface/error";

//handling the zod error. creating our common error format from default zod error
export const handleZodError  = (error:ZodError)=>{ 
    const errorSources:TErrorSource = error.issues.map((issue:ZodIssue)=>{ // errorSources will contain path and message
      return {
        path: issue?.path[issue.path.length - 1], // getting the last property of the path array as it contains why the error is occurring
        message: issue.message
      }
    })
    const statusCode = 400;
    return {
      statusCode,
      message:'Validation Error',
      errorSources,
    }

  }