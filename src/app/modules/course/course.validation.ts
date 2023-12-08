import { z } from "zod";

const preRequisiteCoursesValidationSchema =z.object({
    course:z.string(),
    isDeleted:z.boolean().optional()
})


const createCourseValidationSchema = z.object({
    body:z.object({
        title:z.string({
            invalid_type_error:'must me a string',
            required_error:'required filed'
        }),
    prefix:z.string({
        invalid_type_error:'must be a string',
        required_error:'required filed'
    }),
    code:z.number({
        invalid_type_error:'must me a number',
        required_error:'required filed'
    }),
    credit:z.number({
        invalid_type_error:'must me a number',
        required_error:'required filed'
    }),
    isDeleted:z.boolean().optional(),
    preRequisiteCourses:z.array(preRequisiteCoursesValidationSchema).optional()
    })
})
const updatePreRequisiteCoursesValidationSchema =z.object({
    course:z.string().optional(),
    isDeleted:z.boolean().optional()
})

//const updateCourseValidationSchema = createCourseValidationSchema.partial(); //partial makes all the property optional 

const updateCourseValidationSchema = z.object({
    body:z.object({
        title:z.string({
            invalid_type_error:'must me a string',
            required_error:'required filed'
        }).optional(),
    prefix:z.string({
        invalid_type_error:'must be a string',
        required_error:'required filed'
    }).optional(),
    code:z.number({
        invalid_type_error:'must me a number',
        required_error:'required filed'
    }).optional(),
    credit:z.number({
        invalid_type_error:'must me a number',
        required_error:'required filed'
    }).optional(),
    isDeleted:z.boolean().optional(),
    preRequisiteCourses:z.array(updatePreRequisiteCoursesValidationSchema).optional()
    })
})

export const courseValidation = {
    createCourseValidationSchema,
    updateCourseValidationSchema
}