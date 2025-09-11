'use client';

import AutoScrollBox from '@/components/shared/auto-scroll-box';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';

const LiveTextPanels = ({ transcript, translation, className = '' }) => {
  const ctx = typeof useSocketContext === 'function' ? useSocketContext() : {};
  const transcriptText = transcript ?? ctx?.transcriptText ?? '';
  const translationText = translation ?? ctx?.translationText ?? '';

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="flex-1 min-h-0 overflow-auto">
        <AutoScrollBox text={transcriptText} placeholder="Live transcription" />
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <AutoScrollBox text={translationText} placeholder="Live translation" />
      </div>
    </div>
  );
};

export default LiveTextPanels;
