import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";
//generating studentId
  /**2 roles to follow
   * i. we have to save some ware 0000 and when 1st student created add +1 to that 0000 is the id => 0001
   * ii. 2nd student id will be 1st student id +1 => 0002
   */

const findLastStudentId = async () =>{
    const lastStudent = await User.findOne( 
        {
            role:'student'
        },
        {
            id:1,
            _id:0
        }
    )
    .sort({
        createdAt: -1 // get the latest created student 
    })
    .lean(); //the lean() function is used to convert MongoDB documents into plain JavaScript objects


    //203001 0001
    //latest create hoa student er id amra neya tar id teka last 4 digit alada kore return kore dibo. 
    // r jodi kono student ba user na take mane 1st bar undefined return korbo
    return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
}


  //year semesterCode 4 digit number
  export const generateStudentId = async (payload:TAcademicSemester)=>{

    //first time
    const currentId  = await findLastStudentId() || (0).toString(); // 1st e kuje dekho user ase ki na. takle tar id deya studentId create koro. Na hole 0 deya  studentId create koro

    let incrementId = (Number(currentId) + 1).toString().padStart(4,'0');// 1 so  0001
    //100 so 0100
    // protibar agar id er sate +1 hobe. currentId string return kore ti Number e convert kore + 1 kore hoyce. tar pore abar string e convert kora hoyce next step er jonno
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;

  }