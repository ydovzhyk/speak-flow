'use client';

import AutoScrollBox from '@/components/shared/auto-scroll-box';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';

const LiveTextPanels = () => {
  const { transcriptText, translationText } = useSocketContext();
  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-3">
      <div className="flex-1 min-h-0">
        <AutoScrollBox text={transcriptText} placeholder="Live transcription" />
      </div>
      <div className="flex-1 min-h-0">
        <AutoScrollBox text={translationText} placeholder="Live translation" />
      </div>
    </div>
  );
};

export default LiveTextPanels;
