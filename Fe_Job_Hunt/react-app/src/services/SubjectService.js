import { getRequest, postRequest, putRequest } from "../config/apiCaller";
import { apiPath } from "../config/apiPath"

export const getSubjectByDepartment = async (
    departmentId,
    successCallback,
    errorCallback
) => {
    await getRequest(
        `${apiPath.getSubjectByDepartment}/${departmentId}`,
        {},
        successCallback,
        errorCallback
    );
};
export const getAllSubject = async (
    {},
    successCallback,
    errorCallback
) => {
    await getRequest(
        apiPath.getSubjectByDepartment,
        {},
        successCallback,
        errorCallback
    );
};

export const addSubject = async (
    params = {},
    successCallback,
    errorCallback
) => {
    await postRequest(
        apiPath.addSubject,
        params,
        successCallback,
        errorCallback
    );
};

export const updateSubject = async (
    subjectId,
    params = {},
    successCallback,
    errorCallback
) => {
    await putRequest(
        `${apiPath.updateSubject}/${subjectId}`,
        params,
        successCallback,
        errorCallback
    );
};

