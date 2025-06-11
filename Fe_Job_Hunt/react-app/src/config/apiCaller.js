import axios from 'axios';
import { notification } from 'antd';

const baseURL = 'http://localhost:6969';

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ xử lý 401 cho các request có token (đã đăng nhập)
    // Không xử lý 401 cho login endpoint
    const isLoginRequest = error?.config?.url?.includes('/auth/login') || 
                          error?.config?.url?.includes('/auth/register');
    
    if (error?.response?.status === 401 && !isLoginRequest) {
      const token = localStorage.getItem('access_token');
      
      // Chỉ redirect nếu có token (tức là đã đăng nhập trước đó)
      if (token) {
        notification.warning({
          message: 'Phiên đăng nhập hết hạn',
          description: 'Vui lòng đăng nhập lại',
        });
        
        localStorage.clear();
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
    return Promise.reject(error);
  }
);

const handleError = (error, errorCallback) => {
  const messageError = error?.response?.data?.message || 'Có lỗi xảy ra';
  const isLoginRequest = error?.config?.url?.includes('/auth/login') || 
                         error?.config?.url?.includes('/auth/register');

  // Hiển thị notification error cho tất cả lỗi, trừ 401 của non-login requests đã xử lý ở interceptor
  if (!(error?.response?.status === 401 && !isLoginRequest)) {
    notification.error({ message: messageError });
  }

  if (errorCallback) errorCallback(error);
};

// POST request
export const postRequest = async (
  url = '',
  params = {},
  successCallback,
  errorCallback,
  config = {}
) => {
    console.log("Data Sent:", params);
  try {
    const res = await instance.post(url, params, config);
    if (successCallback) successCallback(res.data);
    return res.data;
  } catch (error) {
    handleError(error, errorCallback);
    // Return null instead of rethrowing the error
    return null;
  }
};

// GET request
export const getRequest = async (
  url = '',
  params = {},
  successCallback,
  errorCallback,
  config = {}
) => {
  try {
    const res = await instance.get(url, { params, ...config });
    if (successCallback) successCallback(res.data);
    return res.data;
  } catch (error) {
    handleError(error, errorCallback);
    // Don't rethrow the error
    return null;
  }
};

// PUT request
export const putRequest = async (
  url = '',
  params = {},
  successCallback,
  errorCallback,
  config = {}
) => {
  try {
    const res = await instance.put(url, params, config);
    if (successCallback) successCallback(res.data);
    return res.data;
  } catch (error) {
    handleError(error, errorCallback);
    // Don't rethrow the error so it doesn't cause an uncaught exception
    return null;
  }
};

// DELETE request
export const deleteRequest = async (
  url = '',
  successCallback,
  errorCallback,
  config = {}
) => {
  try {
    const res = await instance.delete(url, config);
    if (successCallback) successCallback(res.data);
    return res.data;
  } catch (error) {
    handleError(error, errorCallback);
    // Don't rethrow the error
    return null;
  }
};