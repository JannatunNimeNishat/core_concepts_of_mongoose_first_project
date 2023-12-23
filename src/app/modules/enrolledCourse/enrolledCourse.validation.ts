import { z } from 'zod';


//input e sudu offeredCourse ei id asbe. ei id deya amra pore data gula ke kuje nibo r student er id ta student er accessToken tekai poa jabe.  
const createEnrollCourseValidationZodSchema = z.object({
  body: z.object({
    offeredCourse: z.string({ required_error: 'offeredCourse is required' }),
  }),
});

export const EnrollCoursesValidations = {
  createEnrollCourseValidationZodSchema,
};
