import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosRegister,
  axiosLogin,
  axiosLogout,
  axiosGetCurrentUser,
  axiosUpdateUser,
  axiosDeleteUser,
} from '../../api/auth';
import { setCloseButtonAuth } from '../technical/technical-slice';
import { clearUser } from './auth-slice';
import { toast } from 'react-toastify';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosRegister(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('speakflow.authData', JSON.stringify(authData));
      if (data) { toast.success('User successfully created!'); }
      dispatch(setCloseButtonAuth(true));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to create user: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogin(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('speakflow.authData', JSON.stringify(authData));
      dispatch(setCloseButtonAuth(true));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to login: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await axiosLogout();
    } catch (e) {
    } finally {
      localStorage.removeItem('speakflow.authData');
      dispatch(clearUser());
    }
    return { ok: true };
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/current',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authDataJSON = localStorage.getItem('speakflow.authData');
      if (!authDataJSON) {
        return rejectWithValue({
          data: { message: 'Not authenticated' },
          status: 401,
        });
      }
      let authData;
      try {
        authData = JSON.parse(authDataJSON);
      } catch {
        return rejectWithValue({
          data: { message: 'Broken auth data' },
          status: 400,
        });
      }
      const data = await axiosGetCurrentUser(authData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to get current user: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/edit',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosUpdateUser(userData);
      toast.success(`${data.message}`);
      dispatch(getCurrentUser());
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to update user: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/delete',
  async (userId, { dispatch }) => {
    try {
      await axiosDeleteUser(userId);
      toast.success('Your account has been deleted.');
    } catch (e) {
    } finally {
        localStorage.removeItem('speakflow.authData');
        localStorage.removeItem('speakflow.settings');
        dispatch(clearUser());
    }
    return { ok: true };
  }
);
