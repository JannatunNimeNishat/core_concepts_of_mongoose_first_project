import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err:any):TGenericErrorResponse=>{

//Extract value within double quotes using regex
const match = err.message.match(/"([^]*)"/); //from chatGTP
//The extracted value will be in the first capturing group
const extractedMessage = match && match[1]; //from chatGTP

const errorSources:TErrorSources = [
    {
        path:'',
        message:`${extractedMessage} is already exists`
    }
]

    //pattern
  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
}


export default handleDuplicateError;