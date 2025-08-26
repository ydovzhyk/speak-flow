import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: '',
  message: '',
  loading: false,
  screenType: 'isDesctop',
  typeOperation: 'login',
  closeButtonAuth: false,
  inputLanguage: 'en',
  outputLanguage: 'uk',
  appLanguage: 'en',
};

const technical = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setInputLanguage: (store, action) => {
      store.inputLanguage = action.payload;
    },
    setOutputLanguage: (store, action) => {
      store.outputLanguage = action.payload;
    },
    setAppLanguage: (store, action) => {
      store.appLanguage = action.payload;
    },
    setCloseButtonAuth: (store, action) => {
      store.closeButtonAuth = action.payload;
    },
    setTypeOperation: (store, action) => {
      store.typeOperation = action.payload;
    },
    setDefaultTypeOperation: store => {
      store.typeOperation = 'login';
    },
    clearTechnicalError: store => {
      store.error = '';
    },
    clearTechnicalMessage: store => {
      store.message = '';
    },
    setTechnicalError: (store, action) => {
      store.error = action.payload;
    },
    setScreenType: (store, action) => {
      store.screenType = action.payload;
    },
  },

  // extraReducers: (builder) => {
  // }
});

export default technical.reducer;

export const {
  setInputLanguage,
  setOutputLanguage,
  setAppLanguage,
  setCloseButtonAuth,
  setTypeOperation,
  setDefaultTypeOperation,
  clearTechnicalError,
  clearTechnicalMessage,
  setActiveSection,
  setTechnicalError,
  setScreenType,
} = technical.actions;
