'use client';

import AutoScrollBox from '@/components/shared/auto-scroll-box';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import { useSelector } from 'react-redux';
import {
  getInputLanguage,
  getOutputLanguage,
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

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="flex-1 min-h-0 overflow-auto">
        <AutoScrollBox
          text={transcriptText}
          placeholder={`Live transcription (${inputLabel})`}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <AutoScrollBox
          text={translationText}
          placeholder={`Live translation (${outputLabel})`}
        />
      </div>
    </div>
  );
};

export default LiveTextPanels;
