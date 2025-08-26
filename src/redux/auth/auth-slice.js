import { createSlice } from '@reduxjs/toolkit';
import { register, login, logout, updateUser } from './auth-operations';

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
  isLoginPanel: false,
};

const accessAuth = (store, payload) => {
  store.loading = false;
  store.isLogin = true;
  store.user = payload.user;
  store.sid = payload.sid;
  store.accessToken = payload.accessToken;
  store.refreshToken = payload.refreshToken;
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUser: () => ({ ...initialState }),
    clearUserError: store => {
      store.error = null;
    },
    clearUserMessage: store => {
      store.message = null;
    },
    setRefreshUserData: (store, action) => {
      store.sid = action.payload.sid;
      store.accessToken = action.payload.accessToken;
      store.refreshToken = action.payload.refreshToken;
    },
    updateIsLoginPanel: (store, action) => {
      store.isLoginPanel = action.payload;
      store.isLogin = action.payload;
    }
  },

  extraReducers: builder => {
    builder
      // * REGISTER
      .addCase(register.pending, store => {
        store.loading = true;
        store.error = '';
        store.message = '';
      })
      .addCase(register.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.isLogin = true;
        store.user = { ...payload };
        store.sid = payload.sid;
        store.accessToken = payload.accessToken;
        store.refreshToken = payload.refreshToken;
      })
      .addCase(register.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * LOGIN
      .addCase(login.pending, store => {
        store.loading = true;
        store.error = '';
        store.message = '';
      })
      .addCase(login.fulfilled, (store, { payload }) =>
        accessAuth(store, payload)
      )
      .addCase(login.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      //* LOGOUT
      .addCase(logout.pending, store => {
        store.loading = true;
        store.error = '';
        store.message = '';
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // *GET CURRENT USER
      .addCase(updateUser.pending, store => {
        store.loading = true;
        store.isRefreshing = true;
        store.error = '';
        store.message = '';
      })
      .addCase(updateUser.fulfilled, (store, { payload }) => {
        accessAuth(store, payload);
        store.isRefreshing = false;
        store.isLoginPanel = true;
      })
      .addCase(updateUser.rejected, (store, { payload }) => {
        store.loading = false;
        store.isRefreshing = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      });
  },
});

export default auth.reducer;
export const {
  clearUser,
  clearUserError,
  clearUserMessage,
  setRefreshUserData,
  updateIsLoginPanel,
} = auth.actions;
