import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authReducer from './auth/auth-slice';
import technicalReducer from './technical/technical-slice';
import { setupInterceptors } from '../api/auth';
import logger from 'redux-logger';

const isServer = typeof window === 'undefined';

const createPersistedReducer = () => {
  if (isServer) return authReducer;

  const storage = require('redux-persist/lib/storage').default;

  const persistConfig = {
    key: 'auth-sid',
    storage,
    whitelist: ['sid', 'accessToken', 'refreshToken'],
    debug: process.env.NODE_ENV === 'development',
    suppressWarnings: true,
  };

  return persistReducer(persistConfig, authReducer);
};

const finalAuthReducer = createPersistedReducer();

export const store = configureStore({
  reducer: {
    auth: finalAuthReducer,
    technical: technicalReducer,
  },
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'development'
    ) {
      // middlewares.push(logger);
    }

    return middlewares;
  },
});

export const persistor = isServer ? null : persistStore(store);

setupInterceptors(store);
