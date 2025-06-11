import { getRequest, postRequest, putRequest } from "../config/apiCaller"
import { apiPath } from "../config/apiPath"

export const getAllDepartment = async (
    params = {},
    successCallback,
    errorCallback
) => {
    await getRequest(
        `${apiPath.getDepartments}`,
        params,
        successCallback,
        errorCallback
    )
}
export const addDepartment=async(
       params = {},
    successCallback,
    errorCallback
) => {
    await postRequest(
        `${apiPath.addDepartment}`,
        params,
        successCallback,
        errorCallback
    )
}
export const updateDepartment = async(
    departmentId,
    params = {},
    successCallback,
    errorCallback
) => {
    await putRequest(
        `${apiPath.updateDepartment}/${departmentId}`,
        params,
        successCallback,
        errorCallback
    )
}
