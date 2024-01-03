import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    email:{ // newly added
      type:String,
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: true,
      select: 0, // this select 0 will prevent this password field to find
      trim:true
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
      trim:true
    },
    passwordChangeAt: {
      //// password kun specific time e change hosce tar time
      type: Date,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      trim:true
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
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
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  const user = await User.findOne({ id: id }).select('+password'); // select na korle password pabe na karon amra model e select 0 kore rakci. +password mane select 0 kora soho baki sob data dibe.
  return user;
};

//password checker
userSchema.statics.isPasswordMatched = async function (
  incomingPassword: string,
  userSavedPassword,
) {
  const passwordChecked = await bcrypt.compare(
    incomingPassword,
    userSavedPassword,
  );
  return passwordChecked;
};

/*//isJWTAccessTokenIsIssued before password change
kono accessToken jodi hacked hoye jai tokon o agar accessToken deya data access kora jascilo. eta solve korte amra password change korte pari tokon amader collection e new akta fieldAdd hobe "passwordChangedAt" nam e. r amader decoded hoa data r modde je "iat" ei 2 ta amra compare korte pari. jodi "passwordChangedAt" ta recently hoy taile amra agar token ta invaild kore dibo. password change korle agar tokone r kaj korbe na. 
 *7: (index.d.ts) decode hoa accessToken er data amra amader custom Request property user er modde boshia deilam. jate pura app ei user decoded data poa jai. custom property add kora hoyce index.d.ts file e. */

userSchema.statics.isJWTAccessTokenIsIssuedBeforePasswordChanges = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime()/1000; // changed date to milliseconds 
  //age token issue hoyce pore password change hoyce token true return korbe
  // r ta na hole 
  return passwordChangedTime>jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
