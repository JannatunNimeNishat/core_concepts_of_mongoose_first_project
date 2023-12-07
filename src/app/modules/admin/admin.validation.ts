import { z } from "zod";
import { bloodGroup, gender } from "./admin.contant";

const createAdminNameValidationSchema = z.object({
    fistName:z.string({
        invalid_type_error:'must be string',
        required_error:' field is required'
    }),
    middleName:z.string({
        invalid_type_error:'must be string',
    }).optional(),
    lastName:z.string({
        invalid_type_error:'must be string',
        required_error:' field is required'
    }),
})
const updateAdminNameValidationSchema = z.object({
    fistName:z.string({
        invalid_type_error:'must be string',
        required_error:' field is required'
    }).optional(),
    middleName:z.string({
        invalid_type_error:'must be string',
    }).optional(),
    lastName:z.string({
        invalid_type_error:'must be string',
        required_error:' field is required'
    }).optional(),
})

const createAdminValidationSchema = z.object({
    body:z.object({
        password:z.string({
            invalid_type_error:'must be string',
            required_error:'password field is required'
        }),
        admin:z.object({
            designation:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }),
            name:adminNameValidationSchema,
            gender:z.enum([...gender] as [string, ...string[]]),
            dateOfBirth:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }),
            email:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }),
            contactNo:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }),
            bloodGroup:z.enum([...bloodGroup] as [string, ...string[]] ),
            permanentAddress:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }),
            profileImg:z.string({
                invalid_type_error:'must be string',
            }),
        })
    })
})
const updateAdminValidationSchema = z.object({
    body:z.object({
        password:z.string({
            invalid_type_error:'must be string',
            required_error:'password field is required'
        }).optional(),
        admin:z.object({
            designation:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }).optional(),
            name:adminNameValidationSchema.optional(),
            gender:z.enum([...gender] as [string, ...string[]]),
            dateOfBirth:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }).optional(),
            email:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }).optional(),
            contactNo:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }).optional(),
            bloodGroup:z.enum([...bloodGroup] as [string, ...string[]] ).optional(),
            permanentAddress:z.string({
                invalid_type_error:'must be string',
                required_error:' field is required'
            }).optional(),
            profileImg:z.string({
                invalid_type_error:'must be string',
            }).optional(),
        })
    })
})




export const adminValidation = {
    createAdminNameValidationSchema,
    updateAdminNameValidationSchema,
    createAdminValidationSchema,
    updateAdminValidationSchema
}