import { startSession } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { facultySearchableFields } from './faculty.constants';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('user').populate('academicDepartment'),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id); // ai id ta asole mongodb r _id
  // findById() use korata standard. findById mongodb r _id field deya search kore. r findOne _id bade je kono field deya search korte pare
  return result;
};

const updateSingleFacultyFromDB = async (
  id: string,
  payload: Partial<TFaculty>,
) => {
    console.log(id);
  //separate payloads -> primitive and non-primitive data
  const { name, ...remainingFacultyData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value; // { 'name.firstName': 'Test' }
    }
  }
  const result = await Faculty.findByIdAndUpdate( // amra  findByIdAndUpdate korteci mongodb r _id field deya kuje ber kore r etai standard. findOneAndUpdate _id bade onno field gulor upor use kora jai 
    id, // eta asole _id
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteSingleFacultyFromDB = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }
    //getting user _id from deletedFaculty
    const userId = deletedFaculty.user; // deletedFaculty.user contains the _id of the User collection

    const deleteUser = await User.findByIdAndUpdate(
      userId, // eta asole user er _id
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const facultyServices = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateSingleFacultyFromDB,
  deleteSingleFacultyFromDB,
};
