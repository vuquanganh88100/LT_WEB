import { postRequest } from "../config/apiCaller"
import { apiPath } from "../config/apiPath"

export const loginService = async (
    params = {},
    successCallback,
    errorCallback
) => {
    await postRequest(
        `${apiPath.login}`,
        params,
        successCallback,
        errorCallback
    )
}
export const registerService=async(
       params = {},
    successCallback,
    errorCallback
) => {
    await postRequest(
        `${apiPath.register}`,
        params,
        successCallback,
        errorCallback
    )
}
