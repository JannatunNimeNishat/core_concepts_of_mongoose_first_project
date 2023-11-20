import Joi from 'joi';

// Define Joi schemas for the embedded schemas (userNameSchema, guardianSchema, localGuardianSchema)
const userNameValidationJoiSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .max(20)
    .pattern(/^[A-Z][a-z]*$/)
    .message(
      'First name must start with an uppercase letter and have only lowercase letters thereafter. Received: {#value}',
    ),
  middleName: Joi.string().trim(),
  lastName: Joi.string()
    .trim()
    .required()
    .pattern(/^[A-Z][a-z]*$/)
    .message(
      'Last name must start with an uppercase letter and have only lowercase letters thereafter. Received: {#value}',
    ),
});

const guardianValidationJoiSchema = Joi.object({
  fatherName: Joi.string()
    .trim()
    .required()
    .pattern(/^[A-Z][a-z]*$/)
    .message(
      'Father name must start with an uppercase letter and have only lowercase letters thereafter. Received: {#value}',
    ),
  fatherOccupation: Joi.string().trim().required(),
  fatherContactNo: Joi.string().trim().required(),
  motherName: Joi.string()
    .trim()
    .required()
    .pattern(/^[A-Z][a-z]*$/)
    .message(
      'Mother name must start with an uppercase letter and have only lowercase letters thereafter. Received: {#value}',
    ),
  motherOccupation: Joi.string().trim().required(),
  motherContactNo: Joi.string().trim().required(),
});

const localGuardianValidationJoiSchema = Joi.object({
  name: Joi.string().trim().required(),
  occupation: Joi.string().trim().required(),
  contactNo: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
});

// Define the Joi schema for the Student model
const studentValidationJoiSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameValidationJoiSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string().trim(),
  email: Joi.string().trim().email().required(),
  contactNo: Joi.string().trim().required(),
  emergencyContactNo: Joi.string().trim().required(),
  bloodGroup: Joi.string()
    .valid(
      'A',
      'B',
      'AB',
      'O',
      'A+',
      'A-',
      'B+',
      'B-',
      'AB+',
      'AB-',
      'O+',
      'O-',
    )
    .required(),
  presentAddress: Joi.string().trim().required(),
  permanentAddress: Joi.string().trim().required(),
  guardian: guardianValidationJoiSchema.required(),
  localGuardian: localGuardianValidationJoiSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default studentValidationJoiSchema;
