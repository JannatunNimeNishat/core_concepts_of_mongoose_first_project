import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
/** auth middle ware steps
 * 1. getting the accessToken from the req.headers.authorization.
 * 2. check is accessToken coming. If not then return an error 'You are not authorized'.
 * 3. check is the incoming token is valid or not.
 * 3.1: destructuring the data which are essential for following validations
 *4. checking the incoming rolls from route with decoded role, is this user has the access to this route or not
 *5. Other validations. (exist, deleted, blocked)
 *6.checking the accessToken issue time.  kono accessToken jodi hacked hoye jai tokon o agar accessToken deya data access kora jascilo. eta solve korte amra password change korte pari tokon amader collection e new akta fieldAdd hobe "passwordChangedAt" nam e. r amader decoded hoa data r modde je "iat" ei 2 ta amra compare korte pari. jodi "passwordChangedAt" ta recently hoy taile amra agar token ta invaild kore dibo. password change korle agar tokone r kaj korbe na. 
 *7: (index.d.ts) decode hoa accessToken er data amra amader custom Request property user er modde boshia deilam. jate pura app ei user decoded data poa jai. custom property add kora hoyce index.d.ts file e.
 *
 */

// akta route multiple user er access takte pare, so route teka auth call er shomoy multiple USER_ROLE aste pare, so auth er parameter e amra spread kore nici r type ta TUserRole er akta array deya hoyce.
const auth = (...requiredRoles: TUserRole[]) => {

  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //step 1: getting the accessToken
    const token = req.headers.authorization;
    //step 2: if accessToken not sent, then throw an error
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    //step 3: check is the incoming token is valid or not

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    //step 3.1: destructuring the data which are essential for following validations
    const {role,userId, iat} = decoded;
    
    //step 4: checking the incoming rolls from route with decoded role, is this user has the access to this route or not
    if (requiredRoles && !requiredRoles.includes(role)) {
      // requiredRoles is an array
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    //step 5: Other validations. (exist, deleted, blocked)
    const isUserExists = await User?.isUserExistsByCustomId(userId);
    //step 5.1: checking is the user is exist
  
    if (!isUserExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }
  
  
    //step 5.2: checking is user is already deleted
    if (isUserExists?.isDeleted === true) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
    }
  
    //step 5.3: checking is the user is blocked
    if (isUserExists?.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }

//step 6: checking the accessToken issued time, if the passwordChangeAt is getter then iat from JWT. Then invalidate the previous token.
    if(isUserExists.passwordChangeAt && User.isJWTAccessTokenIsIssuedBeforePasswordChanges(isUserExists?.passwordChangeAt, iat as number)){
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }


    //step 7:  decode hoa accessToken er data amra amader custom Request property user er modde boshia deilam. jate pura app ei user decoded data poa jai. custom property add kora hoyce index.d.ts file e.
    req.user = decoded as JwtPayload;

    next();

    /* old jwt verify
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
*/
  });
};

export default auth;
