import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosSaveRecord,
  axiosGetRecords,
  axiosDeleteRecord,
} from '../../api/rcords';
import { setCloseButtonRecords } from './technical-slice';
import { toast } from 'react-toastify';

export const saveRecord = createAsyncThunk(
  'records/save-record',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosSaveRecord(userData);
      if (data) {
        toast.success(`${data.message}`);
      }
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to save record: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);

export const getRecords = createAsyncThunk(
  'records/get-records',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosGetRecords();
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to get records: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'records/delete-record',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await axiosDeleteRecord(userData);
      if (data) {
        toast.success(`${data.message}`);
      }
      return data;
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`Failed to delete record: ${data.message}`);
      return rejectWithValue({ data, status });
    }
  }
);
