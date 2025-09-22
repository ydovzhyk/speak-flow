import axios from 'axios';
import { getAuthDataFromStorage } from '@/utils/auth-data';
import { setRefreshUserData } from '@/redux/auth/auth-slice';

// const REACT_APP_URL = 'http://localhost:4000';
const REACT_APP_URL = 'https://speak-flow-server-fe4ec363ae5c.herokuapp.com';

export const instance = axios.create({
  baseURL: `${REACT_APP_URL}/api`,
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
  const m = String(msg || '').toLowerCase();
  return (
    m.includes('please login again') ||
    m.includes('invalid session') ||
    m.includes('session timed out') ||
    m.includes('refresh end')
  );
}

export function setupInterceptors(store) {
  // === Request ===
  instance.interceptors.request.use(config => {
    const authData = getAuthDataFromStorage(store);
    const u = config.url || '';
    const isRefresh = u.endsWith('/auth/refresh') || u === 'auth/refresh';
    if (authData?.accessToken && !isRefresh) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${authData.accessToken}`,
      };
    }
    return config;
  });

  // === Response ===
  instance.interceptors.response.use(
    r => r,
    async error => {
      const originalRequest = error?.config;
      const { response } = error || {};
      if (!response || !originalRequest) return Promise.reject(error);

      const status = response.status;
      const data = response.data || {};
      const message = data.message || '';
      const code = data.code || '';
      const url = originalRequest.url || '';
      const isRefreshReq =
        url.endsWith('/auth/refresh') || url.includes('/auth/refresh');

      if (isRefreshReq) {
        clearAuthData(store);
        return Promise.reject(error);
      }

      const hardLogoutByCode =
        (status === 401 &&
          (code === 'REFRESH_EXPIRED' || code === 'REFRESH_INVALID')) ||
        (status === 404 &&
          (code === 'USER_NOT_FOUND' || code === 'SESSION_NOT_FOUND'));

      if (
        hardLogoutByCode ||
        (status === 401 && isHardLogoutMessage(message))
      ) {
        clearAuthData(store);
        return Promise.reject(error);
      }

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
            { headers: { Authorization: `Bearer ${authData.refreshToken}` } }
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

      if (status === 403) {
        clearAuthData(store);
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

export const axiosUpdateUser = async userData => {
  const { data } = await instance.post('/auth/edit', userData);
  return data;
};

export const axiosDeleteUser = async id => {
  const { data } = await instance.delete(`/auth/delete/${id}`);
  return data;
};
