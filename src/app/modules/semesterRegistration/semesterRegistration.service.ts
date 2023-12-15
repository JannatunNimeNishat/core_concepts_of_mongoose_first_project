import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //check 1-> jodi 'UPCOMING' othoba 'ONGOING ' kono semesterRegistration already take taile r new kore kono createSemesterRegistration korte dibo na.
  const isThereAnyUpComingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });

  if (isThereAnyUpComingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a ${isThereAnyUpComingOrOngoingSemester.status} registered semester!`,
    );
  }

  //check 2-> if the academicSemester is exist on  academicSemester model
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester); // objectId -> _id asbe ti direct likha jasce

  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester not found!',
    );
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  //check 3-> if the semester is already registered . semesterRegistration age hoyce ki na. hoyle r register kora jabe na.
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {

    //check 1-> je registered semester update korte casci saita exist kore ki na 
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
    if(!isSemesterRegistrationExists){
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester is not found!`,
          );
    }


    //check 2-> amra je semester registration update korte casci setar status jodi ENDED hoye jai, tokon we wil not update anything
   const currentSemesterStatus =isSemesterRegistrationExists?.status;

    if(currentSemesterStatus === 'ENDED'){
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This semester is already ${currentSemesterStatus}`,
          );
    }

    // 3: UPCOMING --> ONGOING --> ENDED 
    //amra ei sequence ta follow korbo UPCOMING teka  --> ONGOING korte parbe --> ENDED korte parbe. but ended teka ongoing ba upcoming korte parbe na. mane sudu samner dik e jabe picone asa possible na

    const requiredStatus = payload?.status;

    //3.1: (UPCOMING --> ENDED not possible)     currentSemesterStatus jeiata database e acon ase, abong jaita amra input e patasci sai 2 ta forward hote hobe, abar skip kore porer ta tao jeta parbe na. 
    if(currentSemesterStatus === 'UPCOMING' && requiredStatus === 'ENDED'){ // acan e amra upcoming teka ongoing korte parbo but input e ended asteca so korte dibo na.
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requiredStatus}`,
          );
    }


    //3.2: (ONGOING --> UPCOMING not possible)
    if(currentSemesterStatus === 'ONGOING' && requiredStatus === 'UPCOMING'){ // piconer dik ao aste parbo na
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `You can not directly change status from ${currentSemesterStatus} to ${requiredStatus}`,
          );
    }

    //4: now we can let it to update the registeredSemester
    const result = await SemesterRegistration.findByIdAndUpdate(id, payload,{new:true, runValidators:true})

    return result;


};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
