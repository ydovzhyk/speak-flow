// src/api/axios.js
import axios from 'axios';
import { getAuthDataFromStorage } from '@/utils/auth-data';
import { setRefreshUserData } from '@/redux/auth/auth-slice';

// const REACT_APP_API_URL = 'http://localhost:4000';
const REACT_APP_API_URL =
  'https://test-task-backend-34db7d47d9c8.herokuapp.com';

export const instance = axios.create({
  baseURL: REACT_APP_API_URL,
});

function clearAuthData(store) {
  try {
    localStorage.removeItem('speakflow.authData');
  } catch {}
  store.dispatch(
    setRefreshUserData({
      accessToken: null,
      refreshToken: null,
      sid: null,
    })
  );
}

function isHardLogoutMessage(msg = '') {
  return (
    msg === 'Please login again' ||
    msg === 'Invalid session' ||
    msg === 'Session timed out, please login again'
  );
}

export function setupInterceptors(store) {
  // === Request ===
  instance.interceptors.request.use(
    config => {
      const authData = getAuthDataFromStorage(store);
      if (
        authData?.accessToken &&
        config.url !== '/auth/refresh'
      ) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${authData.accessToken}`,
        };
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // === Response ===
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error?.config;

      if (!error.response || !originalRequest) {
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      const message = data?.message;

      if (status === 401 && message === 'Unauthorized') {
        if (originalRequest._retry) {
          clearAuthData(store);
          return Promise.reject(error);
        }
        originalRequest._retry = true;

        try {
          const authData = getAuthDataFromStorage(store);
          if (!authData?.refreshToken || !authData?.sid) {
            clearAuthData(store);
            return Promise.reject(error);
          }

          const refreshResp = await instance.post(
            '/auth/refresh',
            { sid: authData.sid },
            {
              headers: {
                Authorization: `Bearer ${authData.refreshToken}`,
              },
            }
          );

          const newData = {
            accessToken: refreshResp.data.newAccessToken,
            refreshToken: refreshResp.data.newRefreshToken,
            sid: refreshResp.data.sid,
          };

          store.dispatch(setRefreshUserData(newData));
          try {
            localStorage.setItem('speakflow.authData', JSON.stringify(newData));
          } catch {}

          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newData.accessToken}`,
          };

          if (originalRequest.url === '/auth/current') {
            originalRequest.data = {
              accessToken: newData.accessToken,
              refreshToken: newData.refreshToken,
              sid: newData.sid,
            };
          }

          return instance(originalRequest);
        } catch (refreshErr) {
          clearAuthData(store);
          return Promise.reject(refreshErr);
        }
      }

      if (status === 401 && isHardLogoutMessage(message)) {
        clearAuthData(store);
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
}

export const axiosRegister = async userData => {
  const { data } = await instance.post('/auth/register', userData);
  return data;
};

export const axiosLogin = async userData => {
  const { data } = await instance.post('/auth/login', userData);
  return data;
};

export const axiosLogout = async () => {
  const { data } = await instance.post('/auth/logout');
  return data;
};

export const axiosGetCurrentUser = async userData => {
  const { data } = await instance.post('/auth/current', userData);
  return data;
};
