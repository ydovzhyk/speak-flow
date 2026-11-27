import { createSelector } from '@reduxjs/toolkit';
export const getTechnicalError = ({ technical }) => technical.error;
export const getTechnicalMessage = ({ technical }) => technical.message;
export const getModalVindowSttus = ({ technical }) =>
  technical.modalWindowStatus;
export const getLoadingTechnical = ({ technical }) => technical.loading;
export const getScreenType = ({ technical }) => technical.screenType;
export const getTypeOperationAuth = ({ technical }) => technical.typeOperationAuth;
export const getTypeOperationRecords = ({ technical }) => technical.typeOperationRecords;
export const getCloseButtonAuth = ({ technical }) => technical.closeButtonAuth;
export const getCloseButtonRecords = ({ technical }) => technical.closeButtonRecords;
export const getInputLanguage = ({ technical }) => technical.inputLanguage;
export const getOutputLanguage = ({ technical }) => technical.outputLanguage;
export const getDeepgramStatus = ({ technical }) => technical.deepgramStatus;
export const getActiveBtn = ({ technical }) => technical.activeBtn;
export const getLine = ({ technical }) => technical.line;
export const getSavedData = ({ technical }) => technical.savedData;
export const getTranscriptArr = ({ technical }) => technical.transcriptArr;
export const getTranslationArr = ({ technical }) => technical.translationArr;
export const getSegments = ({ technical }) => technical.segments || [];
export const getTranscriptJoined = createSelector(
  [getSegments, getTranscriptArr],
  (segments, arr) => {
    if (segments?.length) {
      return segments
        .map(s => s?.source)
        .filter(Boolean)
        .join(' ');
    }
    return (arr || []).join(' ');
  }
);
export const getTranslationJoined = createSelector(
  [getSegments, getTranslationArr],
  (segments, arr) => {
    if (segments?.length) {
      return segments
        .map(s => s?.target)
        .filter(Boolean)
        .join(' ');
    }
    return (arr || []).join(' ');
  }
);
export const getHasAnyText = createSelector(
  [getTranscriptJoined, getTranslationJoined],
  (t1, t2) => Boolean(t1.trim() || t2.trim())
);
