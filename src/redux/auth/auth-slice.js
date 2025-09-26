import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateUser,
  deleteUser,
} from './auth-operations';

const initialState = {
  user: {},
  sid: null,
  accessToken: null,
  refreshToken: null,
  isLogin: null,
  loading: false,
  isRefreshing: false,
  error: null,
  message: null,
};

const errMsg = payload =>
  payload?.data?.message ||
  payload?.message ||
  'Oops, something went wrong, try again';

const applyAuthPayload = (state, payload) => {
  state.loading = false;
  state.isLogin = true;
  state.error = null;

  state.user = payload?.user ?? { ...(payload || {}) };

  if (payload?.sid !== undefined) state.sid = payload.sid;
  if (payload?.accessToken !== undefined)
    state.accessToken = payload.accessToken;
  if (payload?.refreshToken !== undefined)
    state.refreshToken = payload.refreshToken;
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: () => ({ ...initialState }),
    clearUserError: state => {
      state.error = null;
    },
    clearUserMessage: state => {
      state.message = null;
    },
    setRefreshUserData: (state, action) => {
      state.sid = action.payload.sid ?? state.sid;
      state.accessToken = action.payload.accessToken ?? state.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
    },
  },

  extraReducers: builder => {
    builder
      // REGISTER
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        applyAuthPayload(state, payload);
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      })

      // LOGIN
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        applyAuthPayload(state, payload);
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      })

      // LOGOUT
      .addCase(logout.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logout.fulfilled, () => ({
        ...initialState,
        loading: false,
        isLogin: false,
        isLoginPanel: false,
      }))
      .addCase(logout.rejected, () => ({
        ...initialState,
        loading: false,
        isLogin: false,
        isLoginPanel: false,
      }))
      // GET CURRENT USER
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
        state.isRefreshing = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        applyAuthPayload(state, payload);
        state.isRefreshing = false;
        state.isLoginPanel = true;
      })
      .addCase(getCurrentUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.isRefreshing = false;
        state.error = errMsg(payload);
      })

      // UPDATE USER
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.message ?? null;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      })

      // DELETE USER
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.message = payload?.message ?? null;
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      });
  },
});

export default auth.reducer;
export const {
  clearUser,
  clearUserError,
  clearUserMessage,
  setRefreshUserData,
} = auth.actions;
