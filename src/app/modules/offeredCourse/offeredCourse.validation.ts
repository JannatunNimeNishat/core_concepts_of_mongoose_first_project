import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    //academicSemester: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
     // amra time ta Hours:Minutes ai pattern a chai. ei pattern ta amra .refine method er modde regex user kore fixed kore dite pari. 
    startTime: z.string().refine((time)=>{
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    },{
        message:'Invalid time format, expected "HH:MM" in 24 hours format'
    }),
    endTime: z.string().refine((time)=>{
        const regex =  /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    },{
        message:'Invalid time format, expected "HH:MM" in 24 hours format'
    }),
  }).refine((body)=>{
    //amra casci startTime ar endTime jate akta r aktar pore hoy. 12:30 jate kokhon o 10:30 er age na cole ase. 
    //startTime: 10:30 => 1970-01-01T10:30 //endTime: 12:30 => 1970-01-01T12:30
    //amader date ta aki rakte hobe. comparison ta acan e time er sate hobe. r 1970-01-01 teka utc date calu hoyce so standard dora hoyce. 

    const start = new Date(`1970-01-01T${body?.startTime}:00`);
    const end = new Date(`1970-01-01T${body?.endTime}:00`);
    return end > start; // end time start time er teka boro hote hobe. 
  },{
    message:'Stat time should be before end time!.'
  }),
});
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});


export const offeredCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema
}
