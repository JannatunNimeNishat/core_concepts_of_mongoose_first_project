import QueryBuilder from "../../builder/QueryBuilder"
import { facultySearchableFields } from "./faculty.constants"
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



export const facultyServices = {
    getAllFacultyFromDB,
    getSingleFacultyFromDB
}