import { getSubjectByDepartment } from "../services/SubjectService"

export const  API_PATH="/blog/api"
export const apiPath={
    login:API_PATH+"/auth/login",
    register : API_PATH+"/auth/save",

    //department
    getDepartments:API_PATH+"/department",
    addDepartment:API_PATH+"/department/create",
    updateDepartment:API_PATH+"/department/update",

    //subject
    getSubjectByDepartment:API_PATH+"/subject",
    addSubject:API_PATH+"/subject/save",
    updateSubject:API_PATH+"/subject/update",

    //document
    getDocumentBySubject:API_PATH+"/document/subject",
    createDocument:API_PATH+"/document",
    getAllDocuments:API_PATH+"/document",
    updateDocumentStatus:API_PATH+"/document/update-status",
    deleteDocument:API_PATH+"/document"
}