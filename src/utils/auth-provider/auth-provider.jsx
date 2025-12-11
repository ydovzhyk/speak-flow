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

  useEffect(() => {
    if (authData.sid && !isLogin) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, authData.sid, isLogin]);

  // ініт з URL-параметрів (наприклад, після Google OAuth / спец-лінків)
  useEffect(() => {
    const initAuthFromUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const sid = urlParams.get('sid');

      if (accessToken && sid) {
        const data = { accessToken, sid };
        try {
          localStorage.setItem('speakflow.authData', JSON.stringify(data));
        } catch {}
        dispatch(setRefreshUserData(data));
        try {
          const res = await dispatch(getCurrentUser());
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
