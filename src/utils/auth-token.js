import { instance } from '@/api/auth';
import { setRefreshUserData } from '@/redux/auth/auth-slice';

const AUTH_STORAGE_KEY = 'speakflow.authData';
const REFRESH_SKEW_MS = 60 * 1000;

export function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStoredAuth(data) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function getAccessTokenExpiryMs(token) {
  try {
    const payloadPart = String(token || '').split('.')[1];
    if (!payloadPart) return null;

    const payload = JSON.parse(
      atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'))
    );

    return payload?.exp ? Number(payload.exp) * 1000 : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token, skewMs = REFRESH_SKEW_MS) {
  if (!token) return true;

  const expiresAt = getAccessTokenExpiryMs(token);
  if (!expiresAt) return true;

  return Date.now() >= expiresAt - skewMs;
}

export async function refreshAccessSession(sid) {
  const { data } = await instance.post('/auth/refresh', { sid });
  return {
    accessToken: data?.newAccessToken,
    sid: data?.sid ?? sid,
  };
}

export async function ensureFreshAccessToken({ dispatch } = {}) {
  const auth = readStoredAuth();
  if (!auth?.accessToken || !auth?.sid) return auth;

  if (!isAccessTokenExpired(auth.accessToken)) {
    return auth;
  }

  const refreshed = await refreshAccessSession(auth.sid);
  if (!refreshed?.accessToken) {
    return null;
  }

  writeStoredAuth(refreshed);
  dispatch?.(setRefreshUserData(refreshed));

  return refreshed;
}
