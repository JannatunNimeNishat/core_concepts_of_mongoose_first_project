import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
const loginUser = async (payload: TLoginUser) => {
  /** steps:
   * 1. je id input e asbe oi id r user ase ki na.
   * 2. jodi oi user poa jai, then dekte hobe user deleted ki na. mane isDeleted field true ki na.
   * 3. user deleted na hole acon check korte hobe user er status blocked ki na. blocked hole login korte deya jabe na.
   * 4. input a asha password ta abong user er password filed e save hoye taka password tar compaire korte hobe bycript er compare method deya jodi 2 ta match kore then 5th step e jabe
   * 5. uporer 4 ta check tik takle Access Granted hobe r : AccessToken, RefreshToken pathate hobe.
   * 5.1. jwt install normal and typed npm i jsonwebtoken, npm i -D @types/jsonwebtoken
   * 5.2 accessToken create kore user ke pathate hobe
   * 6. sobar last e accessToken r needPasswordChange ta user ke pathaia dite hbe.
   */

  const isUserExists = await User?.isUserExistsByCustomId(payload?.id);
  //step 1: checking is the user is exist

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  /* const isUserExists = await User.findOne({id:payload?.id});
   console.log(isUserExists);
    if(!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND,'This user is not found!');
    } */

  //step 2: checking is user is already deleted
  if (isUserExists?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  //step 3: checking is the user is blocked
  if (isUserExists?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //step 4: checking the password is correct

  if (
    !(await User?.isPasswordMatched(payload?.password, isUserExists?.password))
  ) {
    //match hole true. r na hole false asbe isPasswordMatched er modde.
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong password!');
  }
  // const isPasswordMatched = await bcrypt.compare(payload?.password,isUserExists?.password);
  // match hole true. r na hole false asbe isPasswordMatched er modde.

  // If all the checks are ok then
  //step 5:  Access Granted: Send AccessToken, RefreshToken
  //step 5.1: npm i jsonwebtoken npm i -D @types/jsonwebtoken

  // step 5.2: create accessToken and send to the user
  const jwtPayload = {
    // jar jonno accessToken banano hosce tar kisu info neya jwtPayload create hoy
    userId: isUserExists?.id,
    role: isUserExists?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    needsPasswordChange: isUserExists?.needsPasswordChange,
  };
};

const changePasswordIntoDB = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  console.log('user', user);
  const isUserExists = await User?.isUserExistsByCustomId(user?.userId);

  //step 1: checking is the user is exist
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  //step 2: checking is user is already deleted
  if (isUserExists?.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  //step 3: checking is the user is blocked
  if (isUserExists?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //step 4: checking the password is correct

  if (
    !(await User?.isPasswordMatched(
      payload?.oldPassword,
      isUserExists?.password,
    ))
  ) {
    //match hole true. r na hole false asbe isPasswordMatched er modde.
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong password!');
  }

  //step 5: hashed the newPassword
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.saltRounds),
  );

  // updating the oldPassword with newPassword
  await User.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    { /**amra acan e 2 ta extra field update korteci. needsPasswordChange eta default pasword change hoyce eta bujar jonno. r passwordChangeAt eta kun specific time/date e password change hoyce seta bujar jonno  */
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

export const AuthServices = {
  loginUser,
  changePasswordIntoDB,
};
