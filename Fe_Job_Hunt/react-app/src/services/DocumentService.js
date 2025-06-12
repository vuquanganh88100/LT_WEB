import axios from 'axios';
import { apiPath } from "../config/apiPath"
import { getRequest, postRequest, putRequest, deleteRequest } from '../config/apiCaller';

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

// Get all documents with pagination
export const getAllDocuments = async (
    page = 0,
    size = 10,
    sort = 'createdAt,desc',
    status = null,
    search = null,
    successCallback,
    errorCallback
) => {
    const params = { page, size, sort };
    
    if (status) {
        params.status = status;
    }
    
    if (search) {
        params.search = search;
    }
    
    await getRequest(
        apiPath.getAllDocuments,
        params,
        successCallback,
        errorCallback
    );
};

// Update document status
export const updateDocumentStatus = async (
  documentId,
  status,
  successCallback,
  errorCallback
) => {
  const url = `${apiPath.updateDocumentStatus}?documentId=${documentId}&status=${status}`;
  await postRequest(
    url,
    {}, 
    successCallback,
    errorCallback
  );
};


export const deleteDocument = async (
    documentId,
    successCallback,
    errorCallback
) => {
    await deleteRequest(
        `${apiPath.deleteDocument}/${documentId}`,
        successCallback,
        errorCallback
    );
};