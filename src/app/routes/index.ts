import { Router } from "express";
import { studentRoutes } from "../modules/student/student.route";
import { UserRouters } from "../modules/user/user.route";

const router = Router();

const moduleRoutes= [
    {
        path:'/users',
        route:UserRouters
    },
    {
        path:'/students',
        route:studentRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path,route.route ));

/* router.use('/users', UserRouters);
router.use('/students',studentRoutes); */



export default router;

