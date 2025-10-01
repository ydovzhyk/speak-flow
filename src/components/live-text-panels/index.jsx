'use client';

import AutoScrollBox from '@/components/shared/auto-scroll-box';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import { useSelector } from 'react-redux';
import {
  getInputLanguage,
  getOutputLanguage,
  getActiveBtn,
  getDeepgramStatus,
} from '@/redux/technical/technical-selectors';
import { getLangLabel } from '@/utils/langLabel';

const LiveTextPanels = ({ transcript, translation, className = '' }) => {
  const ctx = typeof useSocketContext === 'function' ? useSocketContext() : {};
  const transcriptText = transcript ?? ctx?.transcriptText ?? '';
  const translationText = translation ?? ctx?.translationText ?? '';
  const inputLang = useSelector(getInputLanguage);
  const outputLang = useSelector(getOutputLanguage);
  const inputLabel = getLangLabel(inputLang);
  const outputLabel = getLangLabel(outputLang);
  const activeBtn = useSelector(getActiveBtn);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const recordingActive = deepgramStatus && activeBtn !== 'pause' && activeBtn !== 'stop';

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="flex-1 min-h-0 overflow-auto">
        <AutoScrollBox
          text={transcriptText}
          placeholder={`Live transcription (${inputLabel})`}
          trailingLoading={recordingActive}
          trailingLabel="Listening"
        />
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <AutoScrollBox
          text={translationText}
          placeholder={`Live translation (${outputLabel})`}
          trailingLoading={recordingActive}
          trailingLabel="Translating"
        />
      </div>
    </div>
  );
};

export default LiveTextPanels;
