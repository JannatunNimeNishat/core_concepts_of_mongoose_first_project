import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';
//generating studentId
/**2 roles to follow
 * i. we have to save some ware 0000 and when 1st student created add +1 to that 0000 is the id => 0001
 * ii. 2nd student id will be 1st student id +1 => 0002
 */
const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1, // get the latest created student
    })
    .lean(); //the lean() function is used to convert MongoDB documents into plain JavaScript objects

  //203001 0001
  //latest create hoa student er id amra neya tar id teka last 4 digit alada kore return kore dibo.
  // r jodi kono student ba user na take mane 1st bar undefined return korbo
  // return lastStudent?.id ? lastStudent.id.substring(6) : undefined;

  //bug fix -> new year ba new semester e student vortry hole tokon agar admit hoa student id er sate 1 jog kore new id banale hosce na. karon 2030010001 jodi immediate age vorty hoa student hoy, r new je vorty hosce casce tar year jodi 2031 hoy authoba semester 02 hoy tahole r agar logic colteca na. ai jonno jate amra agar vorty hoa student id r sate tulona korte pari ti pura id tai acan teka pathano hosce immediate vorty hoa student er
  //2030 01 0001
  return lastStudent?.id ? lastStudent.id : undefined;
};

//year semesterCode 4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  //bug fixed code
  let currentId = (0).toString(); // 0000 by default

  //getting the last admitted student id
  const lastAdmittedStudentId = await findLastStudentId(); //2030010001
  const lastAdmittedStudentSemesterCode = lastAdmittedStudentId?.substring(
    4,
    6,
  ); //01
  const lastAdmittedStudentYear = lastAdmittedStudentId?.substring(0, 4); //2030

  //je student er id generated kora hosce. se je semester and year e vorty hote casce tar info..
  const currentAdmittedStudentSemesterCode = payload.code;
  const currentAdmittedStudentSemesterYear = payload.year;

  /**jodi tik agar student er sate new asha student er semester code r year match hoye jai. tokon agar student id r last 4 digit er sate 1 jog kore new student er id generate hobe */
  if (
    lastAdmittedStudentId &&
    lastAdmittedStudentSemesterCode === currentAdmittedStudentSemesterCode &&
    lastAdmittedStudentYear === currentAdmittedStudentSemesterYear
  ) {
    currentId = lastAdmittedStudentId.substring(6); // 0001
  }

  let currentAdmittedStudentId = (Number(currentId) + 1)
    .toString()
    .padStart(4, '0');
  currentAdmittedStudentId = `${currentAdmittedStudentSemesterYear}${currentAdmittedStudentSemesterCode}${currentAdmittedStudentId}`;

  return currentAdmittedStudentId;

  //first time
  ///const currentId  = await findLastStudentId() || (0).toString(); // 1st e kuje dekho user ase ki na. takle tar id deya studentId create koro. Na hole 0 deya  studentId create koro

  ///let incrementId = (Number(currentId) + 1).toString().padStart(4,'0');// 1 so  0001
  //100 so 0100
  // protibar agar id er sate +1 hobe. currentId string return kore ti Number e convert kore + 1 kore hoyce. tar pore abar string e convert kora hoyce next step er jonno
  /// incrementId = `${payload.year}${payload.code}${incrementId}`;
  /// return incrementId;
};

const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  ).sort({createdAt:-1}).lean();
  
  return lastFaculty?.id ? lastFaculty?.id : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const facultyId = await findLastFacultyId();
  //console.log(facultyId);
  if(facultyId){
      currentId = facultyId.substring(2);
     // console.log(currentId); 
  }
  const currentFacultyId = (Number(currentId)+1).toString().padStart(4,'0');
  //console.log(currentFacultyId);
  const finalFacultyId = `F-${currentFacultyId}`;
  return finalFacultyId;
};
