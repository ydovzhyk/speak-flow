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
      const authData = JSON.parse(authDataJSON);
      const userData = authData;
      const data = await axiosGetCurrentUser(userData);
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
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosDeleteUser(userId);
      toast.success(`${data.message}`);
      localStorage.removeItem('speakflow.authData');
      localStorage.removeItem('speakflow.settings');
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to delete user: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);
