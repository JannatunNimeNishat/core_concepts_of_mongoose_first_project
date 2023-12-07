import QueryBuilder from "../../builder/QueryBuilder"
import { facultySearchableFields } from "./faculty.constants"
import { TFaculty } from "./faculty.interface"
import { Faculty } from "./faculty.model"

const getAllFacultyFromDB = async (query:Record<string, unknown>)=>{

    const facultyQuery = new QueryBuilder(
        Faculty.find()
        .populate('user')
        .populate('academicDepartment'),
        query
    )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

    const result = await facultyQuery.modelQuery;
    return result;
}

const getSingleFacultyFromDB =async (id:string) => {
    const result = await Faculty.findOne({id:id});
    return result;
}

const updateSingleFacultyFromDB =async (id:string, payload:Partial<TFaculty>) => {
    //separate payloads -> primitive and non-primitive data 
    const {name, ...remainingFacultyData} = payload;
    const modifiedUpdatedData:Record<string,unknown> = {...remainingFacultyData}

    if(name && Object.keys(name).length){
        for(const[key,value] of Object.entries(name)){
            modifiedUpdatedData[`name.${key}`] = value; // { 'name.firstName': 'Test' }

        }
    }
    const result = await Faculty.findOneAndUpdate({id:id},modifiedUpdatedData,{new:true, runValidators:true})
  
    return result;

}


export const facultyServices = {
    getAllFacultyFromDB,
    getSingleFacultyFromDB,
    updateSingleFacultyFromDB
}