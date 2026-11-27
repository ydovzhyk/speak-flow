'use client';

import { useCallback, useState } from 'react';
import AutoScrollBox from '@/components/shared/auto-scroll-box';
import LinkedScrollBox from '@/components/shared/linked-scroll-box';
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
  const segments = Array.isArray(ctx?.segments) ? ctx.segments : [];
  const inputLang = useSelector(getInputLanguage);
  const outputLang = useSelector(getOutputLanguage);
  const inputLabel = getLangLabel(inputLang);
  const outputLabel = getLangLabel(outputLang);
  const activeBtn = useSelector(getActiveBtn);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const recordingActive =
    deepgramStatus && activeBtn !== 'pause' && activeBtn !== 'stop';

  const [activeId, setActiveId] = useState(null);

  const onActivate = useCallback(id => {
    setActiveId(id ? String(id) : null);
  }, []);

  // Linked mode only for live session segments (not for plain saved record strings).
  const useLinked =
    !transcript &&
    !translation &&
    segments.some(s => s?.id && s?.source);

  const sourceSegments = useLinked
    ? segments
        .filter(s => s?.source)
        .map(s => ({ id: String(s.id), text: s.source }))
    : [];

  const targetSegments = useLinked
    ? segments
        .filter(s => s?.target)
        .map(s => ({ id: String(s.id), text: s.target }))
    : [];

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="flex-1 min-h-0 overflow-auto">
        {useLinked ? (
          <LinkedScrollBox
            segments={sourceSegments}
            activeId={activeId}
            onActivate={onActivate}
            placeholder={`Live transcription (${inputLabel})`}
            trailingLoading={recordingActive}
            trailingLabel="Listening"
          />
        ) : (
          <AutoScrollBox
            text={transcriptText}
            placeholder={`Live transcription (${inputLabel})`}
            trailingLoading={recordingActive}
            trailingLabel="Listening"
          />
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {useLinked ? (
          <LinkedScrollBox
            segments={targetSegments}
            activeId={activeId}
            onActivate={onActivate}
            placeholder={`Live translation (${outputLabel})`}
            trailingLoading={recordingActive}
            trailingLabel="Translating"
          />
        ) : (
          <AutoScrollBox
            text={translationText}
            placeholder={`Live translation (${outputLabel})`}
            trailingLoading={recordingActive}
            trailingLabel="Translating"
          />
        )}
      </div>
    </div>
  );
};

export default LiveTextPanels;
