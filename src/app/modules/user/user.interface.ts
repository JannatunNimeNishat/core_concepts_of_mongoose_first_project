/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?:Date; // password kun specific time e change hosce tar time
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser>{
  isUserExistsByCustomId(id:string):Promise<TUser | null>
  isPasswordMatched(incomingPassword:string, userSavedPassword:string):Promise<boolean>
  isJWTAccessTokenIsIssuedBeforePasswordChanges(passwordChangedTimestamp: Date,jwtIssuedTimestamp:number):boolean
}

export type TUserRole = keyof typeof USER_ROLE;

