//handling mongoose validation error

import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (error:mongoose.Error.ValidationError):TGenericErrorResponse=>{

    //making our errorSources property
    const errorSources:TErrorSources = Object.values(error.errors).map((val:mongoose.Error.ValidatorError | mongoose.Error.CastError) =>{
            return {
                path:val?.path,
                message:val?.message
            }
        }
    )

    //pattern
    const statusCode = 400;
    return {
      statusCode,
      message:'Validation Error',
      errorSources,
    }
}

export default handleValidationError;

/* default mongoose validation error format
"error": {
        "errors": {
            "name": {
                "name": "ValidatorError",
                "message": "Path `name` is required.",
                "properties": {
                    "message": "Path `name` is required.",
                    "type": "required",
                    "path": "name"
                },
                "kind": "required",
                "path": "name"
            }
        },

*/

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