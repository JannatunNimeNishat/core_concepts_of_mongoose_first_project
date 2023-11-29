import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester, TAcademicSemesterNameCodeMapper } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  /*  //validating the semester code.
amra check korbo 
// Semester Code
//Autumn 01
//Summer 02
//Fall 03
je data asteca saitar modde je Semester name dice saita ar oi semester name er jonno amra je code tik kore dici saita match kore ki na. like Autumn er jonno 01 ase ki na.
*/

 /* type TAcademicSemesterNameCodeMapper = {
    // Autumn: '01';
   // Summer: '02';
   // Fall: '03'; 
    //or we can use map type

    [key:string]:string;
    
  };*/

 /*  const academicSemesterNameCodeMapper:TAcademicSemesterNameCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  }; */

  if(academicSemesterNameCodeMapper[payload.name] !== payload.code){ 
    //1.academicSemesterNameCodeMapper[Autumn] = '01'
    //2. payload.code = '02'
    //3. '01' !== '02'
    
    throw new Error('Invalid Semester Code');

  }

  const result = await AcademicSemester.create(payload);

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
