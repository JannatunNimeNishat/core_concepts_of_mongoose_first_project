import { z } from 'zod';

//input e sudu offeredCourse ei id asbe. ei id deya amra pore data gula ke kuje nibo r student er id ta student er accessToken tekai poa jabe.
const createEnrollCourseValidationZodSchema = z.object({
  body: z.object({
    offeredCourse: z.string({ required_error: 'offeredCourse is required' }),
  }),
});

const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z.number().optional(),
    }),
  }),
});

export const EnrollCoursesValidations = {
  createEnrollCourseValidationZodSchema,
  updateEnrolledCourseMarksValidationSchema,
};
