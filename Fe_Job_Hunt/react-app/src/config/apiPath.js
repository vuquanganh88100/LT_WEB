import { getSubjectByDepartment } from "../services/SubjectService"

export const  API_PATH="/blog/api"
export const apiPath={
    login:API_PATH+"/auth/login",
    register : API_PATH+"/auth/save",

    //department
    getDepartments:API_PATH+"/department",

    //subject
    getSubjectByDepartment:API_PATH+"/subject"
}