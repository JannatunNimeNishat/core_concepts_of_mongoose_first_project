import { z } from 'zod';

import { Gender, bloodGroup } from './faculty.constants';

const createFacultyNameValidationSchema = z.object({
  firstName: z.string({
    invalid_type_error: 'must be an string',
    required_error: 'firstName is required',
  }),
  middleName: z
    .string({
      invalid_type_error: 'must be a string',
    })
    .optional(),
  lastName: z.string({
    invalid_type_error: 'must be a string',
    required_error: 'lastName is required',
  }),
});
const updateFacultyNameValidationSchema = z.object({
  firstName: z.string({
    invalid_type_error: 'must be an string',
    required_error: 'firstName is required',
  }).optional(),
  middleName: z
    .string({
      invalid_type_error: 'must be a string',
    })
    .optional(),
  lastName: z.string({
    invalid_type_error: 'must be a string',
    required_error: 'lastName is required',
  }).optional(),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string(),
    faculty: z.object({
      designation: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'designation field is required',
      }),
      name: createFacultyNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z
        .string({
          invalid_type_error: 'must be a string',
        })
        .optional(),
      email: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'email is required',
      }),
      contactNo: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'contactNo is required',
      }),
      emergencyContactNo: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'emergencyContactNo is required',
      }),
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'presentAddress is required',
      }),
      permanentAddress: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'permanentAddress is required',
      }),
      profileImg: z
        .string({
          invalid_type_error: 'must be a string',
        })
        .optional(),
      academicDepartment: z.string({
        invalid_type_error: 'must be a string',
        required_error: 'academicDepartment is required',
      }),
    }),
  }),
});
const updateFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    faculty: z.object({
      designation: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'designation field is required',
        })
        .optional(),
      name: updateFacultyNameValidationSchema.optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z
        .string({
          invalid_type_error: 'must be a string',
        })
        .optional(),
      email: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'email is required',
        })
        .optional(),
      contactNo: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'contactNo is required',
        })
        .optional(),
      emergencyContactNo: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'emergencyContactNo is required',
        })
        .optional(),
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'presentAddress is required',
        })
        .optional(),
      permanentAddress: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'permanentAddress is required',
        })
        .optional(),
      profileImg: z
        .string({
          invalid_type_error: 'must be a string',
        })
        .optional(),
      academicDepartment: z
        .string({
          invalid_type_error: 'must be a string',
          required_error: 'academicDepartment is required',
        })
        .optional(),
    }),
  }),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
