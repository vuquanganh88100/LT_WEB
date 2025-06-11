import { getRequest } from "../config/apiCaller";
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

