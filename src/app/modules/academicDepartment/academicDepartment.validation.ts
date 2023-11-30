import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error: 'Academic Department must be a string',
        required_error: 'name is required',
      }),
      academicFaculty: z.string({
        invalid_type_error: 'Academic Faculty must be a string',
        required_error: 'Faculty is required',
      }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department must be a string',
      required_error: 'name is required',
    }).optional(),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty must be a string',
      required_error: 'Faculty is required',
    }).optional(),
  }),
});

export const academicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
