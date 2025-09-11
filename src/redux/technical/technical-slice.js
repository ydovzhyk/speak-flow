import { createSlice } from '@reduxjs/toolkit';
import { saveRecord, getRecords, deleteRecord } from './technical-operations';

const MAX_SEGMENTS = 200;

const initialState = {
  error: '',
  message: '',
  loading: false,
  screenType: 'isDesktop',
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
  savedData: { items: [] },
  selectedRecord: null,
  transcriptArr: [],
  translationArr: [],
};

const errMsg = payload =>
  payload?.data?.message ||
  payload?.message ||
  'Oops, something went wrong, try again';

const toItems = payload => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.savedData)) return payload.savedData;
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const maybeItemKeys = [
      '_id',
      'id',
      'title',
      'transcript',
      'translation',
      'savedAt',
      'date',
    ];
    const isSingle =
      Object.keys(payload).some(k => maybeItemKeys.includes(k)) &&
      !payload.items &&
      !payload.savedData;
    if (isSingle) return [payload];
  }
  return [];
};

const technical = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload ?? null;
    },

    pushTranscript: (state, action) => {
      state.transcriptArr.push(String(action.payload ?? ''));
      if (state.transcriptArr.length > MAX_SEGMENTS)
        state.transcriptArr.shift();
    },
    pushTranslation: (state, action) => {
      state.translationArr.push(String(action.payload ?? ''));
      if (state.translationArr.length > MAX_SEGMENTS)
        state.translationArr.shift();
    },
    clearLocalTexts: state => {
      state.transcriptArr = [];
      state.translationArr = [];
    },
    setLine: (state, action) => {
      state.line = action.payload;
    },
    setActiveBtn: (state, action) => {
      state.activeBtn = action.payload;
    },
    setDeepgramStatus: (state, action) => {
      state.deepgramStatus = action.payload;
    },
    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },
    setInputLanguage: (state, action) => {
      state.inputLanguage = action.payload;
    },
    setOutputLanguage: (state, action) => {
      state.outputLanguage = action.payload;
    },
    setCloseButtonAuth: (state, action) => {
      state.closeButtonAuth = action.payload;
    },
    setCloseButtonRecords: (state, action) => {
      state.closeButtonRecords = action.payload;
    },
    setTypeOperationAuth: (state, action) => {
      state.typeOperationAuth = action.payload;
    },
    setTypeOperationRecords: (state, action) => {
      state.typeOperationRecords = action.payload;
    },
    clearTechnicalError: state => {
      state.error = '';
    },
    clearTechnicalMessage: state => {
      state.message = '';
    },
    setTechnicalError: (state, action) => {
      state.error = action.payload ?? '';
    },
    setScreenType: (state, action) => {
      state.screenType = action.payload;
    },
  },

  extraReducers: builder => {
    // SAVE RECORD
    builder
      .addCase(saveRecord.pending, state => {
        state.loading = true;
        state.error = '';
        state.message = '';
      })
      .addCase(saveRecord.fulfilled, (state, { payload }) => {
        state.loading = false;
        const items = toItems(payload);
        if (items.length) state.savedData = { items };
        state.message = payload?.message ?? state.message;
      })
      .addCase(saveRecord.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      });

    // GET RECORDS
    builder
      .addCase(getRecords.pending, state => {
        state.loading = true;
        state.error = '';
        state.message = '';
      })
      .addCase(getRecords.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.savedData = { items: toItems(payload) };
      })
      .addCase(getRecords.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      });

    // DELETE RECORD
    builder
      .addCase(deleteRecord.pending, state => {
        state.loading = true;
        state.error = '';
        state.message = '';
      })
      .addCase(deleteRecord.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.savedData = { items: toItems(payload) };
      })
      .addCase(deleteRecord.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = errMsg(payload);
      });
  },
});

export default technical.reducer;

export const {
  setSelectedRecord,
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
  setTechnicalError,
  setScreenType,
} = technical.actions;
