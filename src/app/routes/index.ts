import { Router } from "express";
import { studentRoutes } from "../modules/student/student.route";
import { UserRouters } from "../modules/user/user.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { facultyRoutes } from "../modules/faculty/faculty.route";
import { CourseRoutes } from "../modules/course/course.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { OfferedCourseRoutes } from "../modules/offeredCourse/offeredCourse.route";


const router = Router();

const moduleRoutes= [
    {
        path:'/users',
        route:UserRouters
    },
    {
        path:'/students',
        route:studentRoutes
    },
    {
        path:'/academic-semesters',
        route:AcademicSemesterRoutes
    },
    {
        path:'/academic-faculties',
        route:AcademicFacultyRoutes
    },
    {
        path:'/academic-departments',
        route:AcademicDepartmentRoutes
    },
    {
        path:'/faculty',
        route:facultyRoutes
    },
    {
        path:'/course',
        route:CourseRoutes
    },
   /*  {                    TODO: Admin module needs to create
        path:'/admin', 
        route:adminRoutes
    }, */
    {
        path:'/semester-registrations',
        route:SemesterRegistrationRoutes
    },
    {
        path:'/offered-courses',
        route:OfferedCourseRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path,route.route));

/* router.use('/users', UserRouters);
router.use('/students',studentRoutes); */



export default router;

