import { getRequest } from "../config/apiCaller"
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