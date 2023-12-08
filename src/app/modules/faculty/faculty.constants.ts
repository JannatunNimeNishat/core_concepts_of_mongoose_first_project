import { TBloodGroup, TGender } from './faculty.interface';

export const bloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const Gender: TGender[] = ['male', 'female', 'others'];

export const facultySearchableFields = [
  'email',
  'id',
  'emergencyContactNo',
  'name.firstName',
  'name.middleName',
  'name.lastName',
  'presentAddress',
];
