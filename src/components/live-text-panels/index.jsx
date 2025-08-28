'use client';

import AutoScrollBox from '@/components/shared/auto-scroll-box';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';

const LiveTextPanels = () => {
  const { transcriptText, translationText } = useSocketContext();
  return (
    <div className='w-full flex flex-col gap-3'>
      <AutoScrollBox text={transcriptText} placeholder="Live transcription" />
      <AutoScrollBox text={translationText} placeholder="Live translation" />
    </div>
  );
}

export default LiveTextPanels;
