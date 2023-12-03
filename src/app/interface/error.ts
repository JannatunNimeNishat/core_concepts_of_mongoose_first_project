export type TErrorSources = {
  path: string | number;
  message: string;
}[]; // akadik issu takte pare ti array of objects



export type TGenericErrorResponse = {
    statusCode: number;
    message:string;
    errorSources:TErrorSources;
}