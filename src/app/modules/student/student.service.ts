// import { TStudent } from './student.interface';
import { startSession } from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';


//getAllStudentsFromDB er moddai amra search and getAll student korbo. jodi url e ?searchTerm=value dey tahole search kore value ber kore anbe. r na dile searchTerm sob student return korbe
const getAllStudentsFromDB = async (query:Record<string, unknown>) => { //{ searchTerm: 'Raf' }

  let searchTerm = ''; //default
  if(query?.searchTerm){ //url e search team deya takle searchTerm er default value replace kore dibe
    searchTerm = query?.searchTerm as string;
  }
  
  //searchTerm er value ke amra 3 ta filed er value te search korteci. ei  jonno map use kore hoyce. r  name, name.firstName, email je kono akta field e match korlai result dibe ai jonno $or use kora hosce. r $options:i case sensitive er jonno.
  //{'email':{$regex:query.searchTerm, $option:i}}
  //or
  //{'name.firstName':{$regex:query.searchTerm, $option:i}}
  //or
  //{'presentAddress':{$regex:query.searchTerm, $option:i}}
  const studentSearchableFields = ['email','name.firstName','presentAddress'];
  const result = await Student.find({
    $or:studentSearchableFields.map((field)=> ({
      [field]:{$regex:searchTerm, $options:'i'} 
    }) )
  })
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudentFormDB = async (id: string) => {
 const result = await Student.findOne({id:id})
 .populate('user')
 .populate('admissionSemester')
 .populate({
  path:'academicDepartment',
  populate:{
    path:'academicFaculty'
  }
 })
  return result;
};

//update students primitive and non-primitive data -> best approach
const updateStudentIntoDB = async (id: string, payload:Partial<TStudent>) => {

  //getting the primitive and non-primitive data
  const {name,guardian, localGuardian, ...remainingStudentData} = payload;

  //creating updatedData object with new data which needs to be updated
  const modifiedUpdatedData:  Record<string, unknown> = {...remainingStudentData};

  /*
  guardian:{
    fatherOccupation:"Teacher"
  }
  guardian.fatherOccupation = Teacher
  name.firstName = Ni7
  name.lastName = Ni7
  */

  //checking the non-primitives fields and nested fields are present or not
  if(name && Object.keys(name).length){
    for(const [key,value] of Object.entries(name)){
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if(guardian && Object.keys(guardian).length){
    for(const [key,value] of Object.entries(guardian)){
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if(localGuardian && Object.keys(localGuardian).length){
    for(const [key,value] of Object.entries(localGuardian)){
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }


 const result = await Student.findOneAndUpdate({id:id},modifiedUpdatedData,{new:true, runValidators:true})
 

  return result;
};


//transaction and rollback delete 
const deleteStudentFromDB = async (id: string) => {
  const session =await startSession();
  try {
    session.startTransaction();

    //->deleting student (transaction-1)

    //amra amader created kora id deya delete korte casci ti findOneAndUpdate use korte hobe. mongoose er _id deya korte cile amra findById korte partam
    const deletedStudent = await Student.findOneAndUpdate({id: id, },{isDeleted: true},{new: true, session});

    if(!deletedStudent){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    //-> deleting user (transaction-2)
    const deletedUser = await User.findOneAndUpdate({id:id},{isDeleted:true},{new:true, session})
    if(!deletedUser){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;


  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFormDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
