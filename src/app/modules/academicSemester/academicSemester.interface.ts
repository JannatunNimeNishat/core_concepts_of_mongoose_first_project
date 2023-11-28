export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemester = {
  id: 'Autumn' | 'Summer' | 'Fall';
  name: '01' | '02' | '03';
  year: Date;
  code: string;
  startMonth: TMonths;
  endMonth: TMonths;
};
