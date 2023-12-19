import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'id is required',
    }),
    password: z.string({
      required_error: 'password is required',
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'oldPassword is required',
    }),
    newPassword: z.string({
      required_error: 'password is required',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    // data ta cookies er modde auto asbe body te asbe na
    refreshToken: z.string({
      required_error: 'Refresh token is require',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
