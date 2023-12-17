import { TDays } from "./offeredCourse.interface"

export type TSchedule = {
    days:TDays[];
    startTime:string;
    endTime:string;
}


//ei function er parameter e assignedSchedules OfferedCourse collection teka array of object akare akadik schedule aste pare ti type ta acan e array hoyce, r newSchedule sudu input teka aktar jonnoi asbe ti sudu object hobe type ta
export const hasTimeConflict = (assignedSchedules:TSchedule[], newSchedule:TSchedule) =>{
 //checking is there any conflict
 //check kore hosce faculty/teacher er  ager neya courser er time (days, startTime,endTime) er sate acon new je course er time ta astece saita conflict hoye jasce ki na.
 //forEach e return e loop break kore na. ti amra for of use korbo
 for(const schedule of assignedSchedules){
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`); // agar startTime
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`); // ager endTime
    const newStartTime = new Date(`1970-01-01T${newSchedule?.startTime}`); // input teka asha startTime
    const newEndTime = new Date(`1970-01-01T${newSchedule?.endTime}`); // input teka asha endTime
    //checking kora hosce aki time a conflict kore ki na.
    //10:30 - 12:30
    //9:30 - 1:30
    if(newStartTime < existingEndTime && newEndTime > existingStartTime){
        return true; // time same hoye gela true return korbe
    }
 }
  /*assignedSchedules.forEach((schedule)=>{
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`); // agar startTime
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`); // ager endTime
    const newStartTime = new Date(`1970-01-01T${newSchedule?.startTime}`); // input teka asha startTime
    const newEndTime = new Date(`1970-01-01T${newSchedule?.endTime}`); // input teka asha endTime
    //checking kora hosce aki time a conflict kore ki na.
    //10:30 - 12:30
    //9:30 - 1:30
    if(newStartTime < existingEndTime && newEndTime > existingStartTime){
        return true;
    }
});
*/
return false; //time same na hoyle false return korbe
}