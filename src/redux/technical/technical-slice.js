import { createSlice } from '@reduxjs/toolkit';
import { saveRecord, getRecords, deleteRecord } from './technical-operations';

const MAX_SEGMENTS = 200;

const initialState = {
  error: '',
  message: '',
  loading: false,
  screenType: 'isDesctop',
  typeOperationAuth: 'login',
  typeOperationRecords: null,
  closeButtonAuth: false,
  closeButtonRecords: false,
  inputLanguage: 'en',
  outputLanguage: 'Ukrainian',
  countdown: true,
  deepgramStatus: false,
  activeBtn: 'stop',
  line: 'speaker',
  savedData: [],
  transcriptArr: [],
  translationArr: [],
};

const technical = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setSelectedRecord: (store, action) => {
      store.selectedRecord = action.payload;
    },
    pushTranscript: (store, action) => {
      store.transcriptArr.push(String(action.payload));
      if (store.transcriptArr.length > MAX_SEGMENTS)
        store.transcriptArr.shift();
    },
    pushTranslation: (store, action) => {
      store.translationArr.push(String(action.payload));
      if (store.translationArr.length > MAX_SEGMENTS)
        store.translationArr.shift();
    },
    clearLocalTexts: store => {
      store.transcriptArr = [];
      store.translationArr = [];
    },
    setLine: (store, action) => {
      store.line = action.payload;
    },
    setActiveBtn: (store, action) => {
      store.activeBtn = action.payload;
    },
    setDeepgramStatus: (store, action) => {
      store.deepgramStatus = action.payload;
    },
    setCountdown: (store, action) => {
      store.countdown = action.payload;
    },
    setInputLanguage: (store, action) => {
      store.inputLanguage = action.payload;
    },
    setOutputLanguage: (store, action) => {
      store.outputLanguage = action.payload;
    },
    setCloseButtonAuth: (store, action) => {
      store.closeButtonAuth = action.payload;
    },
    setCloseButtonRecords: (store, action) => {
      store.closeButtonRecords = action.payload;
    },
    setTypeOperationAuth: (store, action) => {
      store.typeOperationAuth = action.payload;
    },
    setTypeOperationRecords: (store, action) => {
      store.typeOperationRecords = action.payload;
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

  extraReducers: (builder) => {
    // * Save Record
    builder
      .addCase(saveRecord.pending, store => {
        store.loading = true;
        store.error = '';
        store.message = '';
      })
      .addCase(saveRecord.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.savedData = payload;
      })
      .addCase(saveRecord.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * Get Records
      .addCase(getRecords.pending, store => {
        store.loading = true;
        store.error = '';
        store.message = '';
      })
      .addCase(getRecords.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.savedData = payload.savedData;
      })
      .addCase(getRecords.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      })
      // * Delete Record
      .addCase(deleteRecord.pending, store => {
        store.loading = true;
        store.error = '';
        store.message = '';
      })
      .addCase(deleteRecord.fulfilled, (store, { payload }) => {
        store.loading = false;
        store.savedData = payload;
      })
      .addCase(deleteRecord.rejected, (store, { payload }) => {
        store.loading = false;
        if (payload && payload.data && payload.data.message) {
          store.error = payload.data.message;
        } else if (payload && payload.message) {
          store.error = payload.message;
        } else {
          store.error = 'Oops, something went wrong, try again';
        }
      });
  }
});

export default technical.reducer;

export const {
  setCloseButtonRecords,
  setTypeOperationRecords,
  pushTranscript,
  pushTranslation,
  clearLocalTexts,
  setLine,
  setActiveBtn,
  setDeepgramStatus,
  setCountdown,
  setInputLanguage,
  setOutputLanguage,
  setCloseButtonAuth,
  setTypeOperationAuth,
  clearTechnicalError,
  clearTechnicalMessage,
  setActiveSection,
  setTechnicalError,
  setScreenType,
} = technical.actions;
