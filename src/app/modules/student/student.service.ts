// import { TStudent } from './student.interface';
import { startSession } from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

//getAllStudentsFromDB er moddai amra search and getAll student korbo. jodi url e ?searchTerm=value dey tahole search kore value ber kore anbe. r na dile searchTerm sob student return korbe
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //{ searchTerm: 'Raf' }

  //code
  //const queryObject = {...query}; //making copy of the query object

  /*// i. searching

  //code
  let searchTerm = ''; //default
  //code
  if (query?.searchTerm) {
    //url e search team deya takle searchTerm er default value replace kore dibe
    searchTerm = query?.searchTerm as string;
  }

  //searchTerm er value ke amra 3 ta filed er value te search korteci. ei  jonno map use kore hoyce. r  name, name.firstName, email je kono akta field e match korlai result dibe ai jonno $or use kora hosce. r $options:i case sensitive er jonno.
  //ex:
  //{'email':{$regex:query.searchTerm, $option:i}}
  //or
  //{'name.firstName':{$regex:query.searchTerm, $option:i}}
  //or
  //{'presentAddress':{$regex:query.searchTerm, $option:i}}

  //code:
  const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });
  */

  /*// ii. filtering
  //query parameter e asha searchTerm, sort, ba aro onno je gula varibale asbe oigula amra bad deya sudu email ta ke rakteci karon amra email deya filter kortecai. 
  const excludeFields = ['searchTerm','sort', 'limit','page','fields'];
  excludeFields.forEach(el => delete queryObject[el]);
  console.log('base query: ',query);

  //chaining. it works as 2 finds
  const filterQuery = searchQuery
    .find(queryObject)// filter is happening here
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
    */

  /*  // iii. sort 
    let sort = '-createdAt'; //default sort value. jodi sort na ase input teka tokon je last e db te add hobe se sobar 1st e asbe. 

    if(query.sort){
      sort = query.sort as string;
    }
    const sortQuery = filterQuery.sort(sort);
    */

  /* // iv. pagination
    let page = 1; 
    let limit = 1; // by default limit 1
    let skip = 0;

    if(query.limit){
      limit = Number(query.limit);
    }

    if(query.page){
      page = Number(query.page);
      skip = (page-1)*limit;
    }
    const paginateQuery = sortQuery.skip(skip);

    const limitQuery = paginateQuery.limit(limit);
    */

  /* // vi. filed limiting
    let fields = '-__v'; // by default __v bad deya hosce. 

    // incoming format -> 'name,email'
    // converted format -> 'name email'
    if(query.fields){
      fields = (query.fields as string).split(',').join(' ');
    }

    const filedQuery = await limitQuery.select(fields)
  return filedQuery;
  */

  //new
  //queryBuilder
  /* const studentQuery = new QueryBuilder(Student.find(),query).search(studentSearchableFields).filter().sort().paginate().fields(); */
  const studentQuery = new QueryBuilder(
    Student.find()
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal()
  return {
    meta,
    result
  };
};

const getSingleStudentFormDB = async (id: string) => {
  const result = await Student.findById(id)
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

//update students primitive and non-primitive data -> best approach
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  //getting the primitive and non-primitive data
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  //creating updatedData object with new data which needs to be updated
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
  guardian:{
    fatherOccupation:"Teacher"
  }
  guardian.fatherOccupation = Teacher
  name.firstName = Ni7
  name.lastName = Ni7
  */

  //checking the non-primitives fields and nested fields are present or not
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }



  const result = await Student.findByIdAndUpdate(
    id,
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};

//transaction and rollback delete
const deleteStudentFromDB = async (id: string) => {
  const session = await startSession();
  try {
    session.startTransaction();

    //->deleting student (transaction-1)

    //amra amader created kora id deya delete korte casci ti findOneAndUpdate use korte hobe. mongoose er _id deya korte cile amra findById korte partam
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    //getting the users _id from student collection as it is referenced
    const userId = deletedStudent.user;

    //-> deleting user (transaction-2)
    const deletedUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
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
