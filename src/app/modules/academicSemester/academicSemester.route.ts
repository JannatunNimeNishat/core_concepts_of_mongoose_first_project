import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlwares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';


const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(AcademicSemesterValidations.academicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get('/',AcademicSemesterControllers.getAllAcademicSemester)
router.get('/:semesterId',AcademicSemesterControllers.getSingleAcademicSemester)

router.patch('/:semesterId',validateRequest(AcademicSemesterValidations.academicSemesterValidationSchema),AcademicSemesterControllers.updateAcademicSemester)


export const AcademicSemesterRoutes = router;
