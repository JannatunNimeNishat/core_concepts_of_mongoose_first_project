import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [ //as the default error format gives us strate forward data
    {
      
      path: error.path,
      message: error.message,
    },
  ];

  //pattern
  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;

/**default mongoose cast error format
 * "error": {
        "stringValue": "\"avavav\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "avavav",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"avavav\" (type string) at path \"_id\" for model \"AcademicDepartment\""
    },
 * 
 */
