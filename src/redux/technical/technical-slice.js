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
  outputLanguage: 'uk',
  countdown: true,
  deepgramStatus: false,
  activeBtn: 'stop',
  line: 'speaker',
  savedData: [],
  transcriptArr: [],
  translationArr: [],
  // Linked sentence pairs for highlight sync: { id, source, target }
  segments: [],
};

const errMsg = payload =>
  payload?.data?.message ||
  payload?.message ||
  'Oops, something went wrong, try again';

const technical = createSlice({
  name: 'technical',
  initialState,
  reducers: {
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
    upsertSourceSegment: (store, action) => {
      const id = String(action.payload?.id || '');
      const source = String(
        action.payload?.source ?? action.payload?.text ?? ''
      ).trim();
      if (!id || !source) return;

      const idx = store.segments.findIndex(s => s.id === id);
      if (idx >= 0) {
        store.segments[idx].source = source;
      } else {
        store.segments.push({ id, source, target: null });
      }

      if (store.segments.length > MAX_SEGMENTS) {
        store.segments = store.segments.slice(-MAX_SEGMENTS);
      }

      // Keep legacy arrays derived from pairs (never used for linking).
      store.transcriptArr = store.segments
        .map(s => s.source)
        .filter(Boolean)
        .slice(-MAX_SEGMENTS);
    },
    /**
     * Full pair upsert - source + target bound by the same id.
     * target may be null when translation was skipped.
     */
    upsertPairSegment: (store, action) => {
      const id = String(action.payload?.id || '');
      if (!id) return;

      const source = String(action.payload?.source || '').trim();
      const rawTarget = action.payload?.target;
      const target =
        rawTarget == null || String(rawTarget).trim() === ''
          ? null
          : String(rawTarget).trim();

      const idx = store.segments.findIndex(s => s.id === id);
      if (idx >= 0) {
        if (source) store.segments[idx].source = source;
        store.segments[idx].target = target;
      } else {
        store.segments.push({
          id,
          source: source || '',
          target,
        });
      }

      if (store.segments.length > MAX_SEGMENTS) {
        store.segments = store.segments.slice(-MAX_SEGMENTS);
      }

      store.transcriptArr = store.segments
        .map(s => s.source)
        .filter(Boolean)
        .slice(-MAX_SEGMENTS);
      store.translationArr = store.segments
        .map(s => s.target)
        .filter(Boolean)
        .slice(-MAX_SEGMENTS);
    },
    clearLocalTexts: store => {
      store.transcriptArr = [];
      store.translationArr = [];
      store.segments = [];
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

  extraReducers: builder => {
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
        store.error = errMsg(payload);
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
        store.error = errMsg(payload);
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
        store.error = errMsg(payload);
      });
  },
});

export default technical.reducer;

export const {
  setCloseButtonRecords,
  setTypeOperationRecords,
  pushTranscript,
  pushTranslation,
  upsertSourceSegment,
  upsertPairSegment,
  clearLocalTexts,
  setLine,
  setActiveBtn,
  setDeepgramStatus,
  setInputLanguage,
  setOutputLanguage,
  setCloseButtonAuth,
  setTypeOperationAuth,
  clearTechnicalError,
  clearTechnicalMessage,
  setTechnicalError,
  setScreenType,
} = technical.actions;
