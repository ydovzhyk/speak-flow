'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveBtn } from '@/redux/technical/technical-slice';
import { getActiveBtn } from '@/redux/technical/technical-selectors';

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

  return (
    <div className="flex w-full items-center justify-center md:items-start md:justify-between gap-4">
      <div className="flex items-center gap-4">

        <div className="relative h-[27px] w-[42px] flex items-center justify-center">
          {isActiveBtn !== 'record' ? (
            <img
              src={'/images/buttons/play_white.png'}
              alt="record"
              className="h-[27px] w-auto cursor-pointer select-none"
              onClick={() => handleButtonClick('record')}
            />
          ) : (
            <div className="relative h-[27px] w-auto">
              <img
                src="/images/buttons/rec_white.png"
                alt="recording"
                className={`h-[28px] w-auto transition-opacity duration-500 ${showFirstImage ? 'opacity-100' : 'opacity-0'}`}
              />
              <img
                src="/images/buttons/rec_dark.png"
                alt="recording"
                className={`absolute left-0 top-0 h-[27px] w-auto transition-opacity duration-500 ${showFirstImage ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
          )}
        </div>

        <img
          src={
            isActiveBtn === 'pause'
              ? '/images/buttons/pause_dark.png'
              : '/images/buttons/pause_white.png'
          }
          alt="pause"
          className="h-[27px] w-auto cursor-pointer select-none"
          onClick={() => handleButtonClick('pause')}
        />

        <img
          src={
            isActiveBtn === 'stop'
              ? '/images/buttons/stop_dark.png'
              : '/images/buttons/stop_white.png'
          }
          alt="stop"
          className="h-[27px] w-auto cursor-pointer select-none"
          onClick={() => handleButtonClick('stop')}
        />
      </div>
    </div>
  );
};

export default PlayModePanel;

