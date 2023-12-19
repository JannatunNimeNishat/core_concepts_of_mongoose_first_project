import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
const userSchema = new Schema<TUser,UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select:0, // this select 0 will prevent this password field to find 
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default:'in-progress'
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //created and updatedAt will automatically created by mongoose
  },
);


//middle ware


userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.saltRounds));
  next();
}); 


// set '' after saving password
 userSchema.post('save', function (doc, next) {
  doc.password = ''; 
  next();
}); 


//Auth validation static methods
userSchema.statics.isUserExistsByCustomId = async function (id:string) {
  const user = await User.findOne({id:id});
  return user;
}

//password checker
userSchema.statics.isPasswordMatched = async function (incomingPassword:string, userSavedPassword) {
  const passwordChecked = await bcrypt.compare(incomingPassword,userSavedPassword);
  return passwordChecked;
}


export const User = model<TUser, UserModel>('User', userSchema);
