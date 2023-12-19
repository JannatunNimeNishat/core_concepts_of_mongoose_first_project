import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
/** auth middle ware steps
 * 1. getting the accessToken from the req.headers.authorization.
 * 2. check is accessToken coming. If not then return an error 'You are not authorized'.
 * 
 * 
 */

const auth = ()=>{
    return catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
        //step 1: getting the accessToken
        const token  = req.headers.authorization;
        //step 2: if accessToken not sent, then throw an error
        if(!token){
            throw new AppError(httpStatus.UNAUTHORIZED,'You are not authorized');
        }
        //step 3: check is the incoming token is valid or not
        jwt.verify(token, config.jwt_access_secret as string, function (err,decode){
            if(err){
                throw new AppError(httpStatus.UNAUTHORIZED,'You are not authorized');
            }
            
           // console.log(decode);

            //step 3.1:  decode hoa token data amra amader custom Request property user er modde boshia deilam. jate pura app ei user decoded data poa jai. custom property add kora hoyce index.d.ts file e. 
            req.user = decode as JwtPayload;

            next();
        });
    });
}


export default auth;