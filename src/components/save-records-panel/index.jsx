'use client';

import { Tooltip } from 'react-tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { getLogin } from '@/redux/auth/auth-selectors';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import { getSavedData } from '@/redux/technical/technical-selectors';
import { clearLocalTexts, setTypeOperationRecords } from '@/redux/technical/technical-slice';
import { useTranslate } from '@/utils/translating/translating';
import RetroPlayerButton from '@/components/shared/retro-player-button';
import {
  ClearIcon,
  OpenIcon,
  SaveIcon,
} from '@/components/shared/retro-player-button/icons';

const SaveRecordsPanel = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector(getLogin);
  const { transcriptText, translationText, resetTranscript, resetTranslation } =
    useSocketContext();
  const savedData = useSelector(getSavedData);

  const hasTranscript = !!transcriptText?.trim();
  const hasTranslation = !!translationText?.trim();
  const hasAnyText = hasTranscript || hasTranslation;
  const hasSaved =
    !!(
      savedData &&
      (Array.isArray(savedData)
        ? savedData.length
        : Object.keys(savedData || {}).length)
    ) || !!savedData?.date;

  const saveDisabledReason = !isLogin
    ? 'Please sign in before saving your records. Only registered users can save transcripts and translations.'
    : !hasAnyText
      ? 'Nothing to save yet. Record to get a transcript or translation.'
      : null;

  const openDisabledReason = !isLogin
    ? 'Please sign in before opening your records. Only registered users can access transcripts and translations.'
    : !hasSaved
      ? 'No saved records found.'
      : null;

  const clearDisabledReason = !hasAnyText ? 'Nothing to clear.' : null;

  const saveTip = useTranslate(saveDisabledReason || '');
  const openTip = useTranslate(openDisabledReason || '');
  const clearTip = useTranslate(clearDisabledReason || '');

  const saveDisabled = !!saveDisabledReason;
  const openDisabled = !!openDisabledReason;
  const clearDisabled = !!clearDisabledReason;

  const handleClear = () => {
    if (clearDisabled) return;
    resetTranscript();
    resetTranslation();
    dispatch(clearLocalTexts());
  };

  return (
    <div className="flex items-center gap-2">
      <RetroPlayerButton
        ariaLabel="Save records"
        utility
        disabled={saveDisabled}
        onClick={() => dispatch(setTypeOperationRecords('SaveRecords'))}
        data-tooltip-id={saveDisabled ? 'save-tooltip' : undefined}
        data-tooltip-content={
          saveDisabled ? saveTip || saveDisabledReason : undefined
        }
      >
        <SaveIcon />
      </RetroPlayerButton>
      <Tooltip
        id="save-tooltip"
        place="left"
        positionStrategy="fixed"
        style={{
          width: 200,
          backgroundColor: '#0f1d2d',
          borderRadius: '5px',
          padding: '6px 10px',
          fontSize: '12px',
          color: '#fff',
        }}
      />

      <RetroPlayerButton
        ariaLabel="Open saved records"
        utility
        disabled={openDisabled}
        onClick={() => dispatch(setTypeOperationRecords('GetRecords'))}
        data-tooltip-id={openDisabled ? 'open-tooltip' : undefined}
        data-tooltip-content={
          openDisabled ? openTip || openDisabledReason : undefined
        }
      >
        <OpenIcon />
      </RetroPlayerButton>
      <Tooltip
        id="open-tooltip"
        place="left"
        positionStrategy="fixed"
        style={{
          width: 200,
          backgroundColor: '#0f1d2d',
          borderRadius: '5px',
          padding: '6px 10px',
          fontSize: '12px',
          color: '#fff',
        }}
      />

      <RetroPlayerButton
        ariaLabel="Clear records"
        utility
        disabled={clearDisabled}
        onClick={handleClear}
        data-tooltip-id={clearDisabled ? 'clear-tooltip' : undefined}
        data-tooltip-content={
          clearDisabled ? clearTip || clearDisabledReason : undefined
        }
      >
        <ClearIcon />
      </RetroPlayerButton>
      <Tooltip
        id="clear-tooltip"
        place="left"
        positionStrategy="fixed"
        style={{
          width: 200,
          backgroundColor: '#0f1d2d',
          borderRadius: 5,
          padding: '6px 10px',
          fontSize: 12,
          color: '#fff',
        }}
      />
    </div>
  );
};

export default SaveRecordsPanel;
