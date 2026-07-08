'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveBtn } from '@/redux/technical/technical-slice';
import { getActiveBtn } from '@/redux/technical/technical-selectors';
import RetroPlayerButton from '@/components/shared/retro-player-button';
import {
  PauseIcon,
  PlayIcon,
  RecIcon,
  StopIcon,
} from '@/components/shared/retro-player-button/icons';

const PlayModePanel = () => {
  const dispatch = useDispatch();
  const isActiveBtn = useSelector(getActiveBtn);

  const [showFirstImage, setShowFirstImage] = useState(true);

  useEffect(() => {
    if (isActiveBtn !== 'record') {
      setShowFirstImage(true);
      return;
    }
    const t = setInterval(() => setShowFirstImage(v => !v), 1500);
    return () => clearInterval(t);
  }, [isActiveBtn]);

  const handleButtonClick = btnType => {
    dispatch(setActiveBtn(btnType));
  };

  const isRecording = isActiveBtn === 'record';

  return (
    <div className="flex items-center gap-2">
      <RetroPlayerButton
        ariaLabel={isRecording ? 'Recording' : 'Record'}
        pressed={isRecording}
        wide
        onClick={() => handleButtonClick('record')}
      >
        {isRecording ? (
          <RecIcon bright={showFirstImage} />
        ) : (
          <PlayIcon />
        )}
      </RetroPlayerButton>

      <RetroPlayerButton
        ariaLabel="Pause"
        pressed={isActiveBtn === 'pause'}
        onClick={() => handleButtonClick('pause')}
      >
        <PauseIcon />
      </RetroPlayerButton>

      <RetroPlayerButton
        ariaLabel="Stop"
        pressed={isActiveBtn === 'stop'}
        onClick={() => handleButtonClick('stop')}
      >
        <StopIcon />
      </RetroPlayerButton>
    </div>
  );
};

export default PlayModePanel;
