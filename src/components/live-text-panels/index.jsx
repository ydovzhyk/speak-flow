'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

const TOOL_BODY_ID = 'speakflow-tool-body';

const LiveTextPanels = ({
  transcript,
  translation,
  segments: segmentsProp,
  className = '',
}) => {
  const ctx = typeof useSocketContext === 'function' ? useSocketContext() : {};
  const transcriptText = transcript ?? ctx?.transcriptText ?? '';
  const translationText = translation ?? ctx?.translationText ?? '';
  const liveMode =
    transcript == null && translation == null && segmentsProp == null;
  const segments = Array.isArray(segmentsProp)
    ? segmentsProp
    : liveMode && Array.isArray(ctx?.segments)
      ? ctx.segments
      : [];
  const inputLang = useSelector(getInputLanguage);
  const outputLang = useSelector(getOutputLanguage);
  const inputLabel = getLangLabel(inputLang);
  const outputLabel = getLangLabel(outputLang);
  const activeBtn = useSelector(getActiveBtn);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const recordingActive =
    liveMode &&
    deepgramStatus &&
    activeBtn !== 'pause' &&
    activeBtn !== 'stop';

  const [activeId, setActiveId] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState(null); // 'transcript' | 'translation' | null
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(typeof document !== 'undefined');
  }, []);

  // Reset highlight when opening another saved record.
  useEffect(() => {
    setActiveId(null);
  }, [segmentsProp, transcript, translation]);

  const onActivate = useCallback(id => {
    setActiveId(id ? String(id) : null);
  }, []);

  const useLinked = segments.some(s => s?.id && s?.source);

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

  const showExpand = liveMode;

  const renderPanel = (kind, { expanded = false } = {}) => {
    const isTranscript = kind === 'transcript';
    const placeholder = isTranscript
      ? `Live transcription (${inputLabel})`
      : `Live translation (${outputLabel})`;
    const trailingLabel = isTranscript ? 'Listening' : 'Translating';
    const onExpand = showExpand
      ? () => setExpandedPanel(kind)
      : undefined;

    if (useLinked) {
      return (
        <LinkedScrollBox
          segments={isTranscript ? sourceSegments : targetSegments}
          activeId={activeId}
          onActivate={onActivate}
          placeholder={placeholder}
          trailingLoading={recordingActive}
          trailingLabel={trailingLabel}
          showExpand={showExpand && !expanded}
          onExpand={onExpand}
          showCopy
        />
      );
    }

    return (
      <AutoScrollBox
        text={isTranscript ? transcriptText : translationText}
        placeholder={placeholder}
        trailingLoading={recordingActive}
        trailingLabel={trailingLabel}
        showExpand={showExpand && !expanded}
        onExpand={onExpand}
        showCopy
      />
    );
  };

  const toolBody =
    portalReady && typeof document !== 'undefined'
      ? document.getElementById(TOOL_BODY_ID)
      : null;

  const expandedOverlay =
    expandedPanel && toolBody
      ? createPortal(
          <div className="absolute inset-0 z-20 bg-white flex flex-col px-4 pb-4 pt-2">
            <div className="flex justify-end items-center shrink-0 mb-2 min-h-[28px]">
              <button
                type="button"
                onClick={() => setExpandedPanel(null)}
                className="text-sm text-[var(--text-accent)] hover:text-[var(--text-main)]"
                aria-label="Close expanded panel"
              >
                ✖
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {renderPanel(expandedPanel, { expanded: true })}
            </div>
          </div>,
          toolBody
        )
      : null;

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="flex-1 min-h-0 overflow-auto">
        {renderPanel('transcript')}
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        {renderPanel('translation')}
      </div>
      {expandedOverlay}
    </div>
  );
};

export default LiveTextPanels;
export { TOOL_BODY_ID };
