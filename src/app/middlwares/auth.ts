import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
/** auth middle ware steps
 * 1. getting the accessToken from the req.headers.authorization.
 * 2. check is accessToken coming. If not then return an error 'You are not authorized'.
 * 3. heck is the incoming token is valid or not.
 *
 *5: (index.d.ts) decode hoa accessToken er data amra amader custom Request property user er modde boshia deilam. jate pura app ei user decoded data poa jai. custom property add kora hoyce index.d.ts file e.
 *
 */

// akt route multiple user er access takte pare, so route teka auth call er shomoy multiple USER_ROLE aste pare, so auth er parameter e amra spread kore nici r type ta TUserRole er akta array deya hoyce.
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //step 1: getting the accessToken
    const token = req.headers.authorization;
    //step 2: if accessToken not sent, then throw an error
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    //step 3: check is the incoming token is valid or not
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decode) {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        //step 4: checking the incoming rolls from route with decoded role, is this user has the access to this route or not
        const role = (decode as JwtPayload).role;
     
        if (requiredRoles && !requiredRoles.includes(role)) { // requiredRoles is an array
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        //step 5:  decode hoa accessToken er data amra amader custom Request property user er modde boshia deilam. jate pura app ei user decoded data poa jai. custom property add kora hoyce index.d.ts file e.
        req.user = decode as JwtPayload;

        next();
      },
    );
  });
};

export default auth;
