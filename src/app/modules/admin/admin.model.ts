import { Schema, model } from 'mongoose';
import { TAdmin, TAname } from './admin.interface';
import { bloodGroup } from './admin.contant';

const adminNameSchema = new Schema<TAname>({
  firstName: { 
    type: String,
    required: [true, 'firstName is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'lastName is required'],
    maxlength: [20, 'lastName can not be more than 20 characters'],
  },
});
const adminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: [true, 'id field is required'],
    },
    user: {
      type: Schema.ObjectId,
      required: [true, 'user field is required'],
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'designation field is required'],
    },
    name: {
      type: adminNameSchema,
      required: [true, 'name field is required'],
    },
    gender: {
      type: String,
      required: [true, 'gender field is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'dateOfBirth field is required'],
    },
    email: {
      type: String,
      required: [true, 'email field is required'],
    },
    contactNo: {
      type: String,
      required: [true, 'contactNo field is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'emergencyContactNo field is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: bloodGroup,
        message: '{VALUE} is not a blood group',
      },
    },
    permanentAddress: {
      type: String,
      required: [true, 'permanentAddress field is required'],
    },
    profileImg: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);



adminSchema.virtual('fullName').get(function (){
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
})

//avoiding deleted admins
adminNameSchema.pre('find', function (next){
    this.find({isDeleted:{$ne:true}}) ;
    next()
})
adminNameSchema.pre('findOne', function (next){
   // this.find({ isDeleted: { $ne: true } });
    this.find({isDeleted:{$ne:true}}) ;
    next()
})

adminNameSchema.pre('aggregate', async function (next) {
    //console.log(this.pipeline());
    // [{ $match: { isDeleted: { $ne: true } } }, { '$match': { id: '123452' } } ]
    //here we filter out the deleted fields
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
  });



export const Admin = model<TAdmin>('admin', adminSchema);
