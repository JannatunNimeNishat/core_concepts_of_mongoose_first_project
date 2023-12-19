import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
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
            //decode the token data
            console.log(decode);
            const {userId, role} = decode;

            //step 3.1: 

        });
    next();
    });
}


export default auth;