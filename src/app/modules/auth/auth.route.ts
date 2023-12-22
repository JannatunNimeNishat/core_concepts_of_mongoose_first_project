import { Router } from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);


router.post('/refresh-token',
validateRequest(AuthValidation.refreshTokenValidationSchema),
AuthController.refreshToken
)

//new
/*1. forget-password:
forget password route deya amra backend ke request korbo password reset er jonno. backend amader akta url dibe 
(http://localhost:3000?id=A-0001?token=abvaceavaev) eita deya abar amra reset api call dibo*/

router.post('/forget-password',
validateRequest(AuthValidation.forgetPasswordValidationSchema),
AuthController.forgetPassword
)
/**2. Reset password route
 * Email e pathano url teka amra userId, token ke alada kore felbo. Then userId r newPassword ke body and token ke headers er authorization e set kore ai "reset-password" api hit korbo. 
 */
router.post('/reset-password',
validateRequest(AuthValidation.resetPasswordValidationSchema),
AuthController.resetPassword
)



export const AuthRoutes = router;
