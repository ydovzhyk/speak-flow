'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getLogin } from '@/redux/auth/auth-selectors';
import { getCurrentUser } from '@/redux/auth/auth-operations';
import { setRefreshUserData } from '@/redux/auth/auth-slice';
import { setCloseButtonAuth } from '@/redux/technical/technical-slice';

const AuthProvider = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLogin = useSelector(getLogin);
  const authData = useSelector(state => state.auth);

  // Якщо вже є токени, але користувач не завантажений — тягнемо профіль
  useEffect(() => {
    if (
      authData.accessToken &&
      authData.refreshToken &&
      authData.sid &&
      !isLogin
    ) {
      dispatch(
        getCurrentUser({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          sid: authData.sid,
        })
      );
    }
  }, [
    dispatch,
    authData.accessToken,
    authData.refreshToken,
    authData.sid,
    isLogin,
  ]);

  // ініт з URL-параметрів
  useEffect(() => {
    const initAuthFromUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const sid = urlParams.get('sid');

      if (accessToken && refreshToken && sid) {
        const data = { accessToken, refreshToken, sid };
        localStorage.setItem('speakflow.authData', JSON.stringify(data));
        dispatch(setRefreshUserData(data));
        try {
          const res = await dispatch(getCurrentUser(data));
          if (!res.error) {
            dispatch(setCloseButtonAuth(true));
          }
        } finally {
          router.replace(window.location.pathname);
        }
      }
    };

    initAuthFromUrl();
  }, [dispatch, router]);

  return null;
};

export default AuthProvider;
