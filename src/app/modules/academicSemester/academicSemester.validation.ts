import { z } from "zod";
import { AcademicSemesterName,AcademicSemesterCode, Months } from "./academicSemester.constant";


const academicSemesterValidationSchema = z.object({
    body:z.object({
        name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
        year: z.date(),
        code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
        startMonth: z.enum([...Months] as [string, ...string[]]),
        endMonth:z.enum([...Months] as [string, ...string[]]),
    })
})

export const AcademicSemesterValidation = {
    academicSemesterValidationSchema
}