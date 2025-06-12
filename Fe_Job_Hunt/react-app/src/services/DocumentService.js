import axios from 'axios';
import { apiPath } from "../config/apiPath"
import { getRequest, postRequest } from '../config/apiCaller';

export const getDocumentsBySubject = async (
    subjectId,
    successCallback,
    errorCallback
) => {
    await getRequest(
        apiPath.getDocumentBySubject,
        { subjectId },
        successCallback,
        errorCallback
    );
};

// Add a new document with optional files
export const addDocument = async (documentData, files, successCallback, errorCallback) => {
    const formData = new FormData();
    
    formData.append('document', JSON.stringify(documentData));
    
    if (files && files.length > 0) {
        files.forEach(file => {
            formData.append('files', file);
        });
    }
    
    await postRequest(
        apiPath.createDocument,
        formData,
        successCallback,
        errorCallback,
        { 
            'Content-Type': 'multipart/form-data'
        }
    );
};