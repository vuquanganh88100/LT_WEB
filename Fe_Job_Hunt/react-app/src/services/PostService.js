import { getRequest, postRequest } from "../config/apiCaller";
import { apiPath } from "../config/apiPath";

export const addPost = async (
    params = {},
    successCallback,
    errorCallback
) => {
    await postRequest(
        apiPath.createPost,
        params,
        successCallback,
        errorCallback
    );
};
export const getAllPost = async (
    params = {},
    successCallback,
    errorCallback
) => {
    await getRequest(
        apiPath.getAllPost,
        params,
        successCallback,
        errorCallback
    );
};


// Export all functions as a default object
export default {
    addPost
};