'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getActiveBtn,
  getDeepgramStatus,
} from '@/redux/technical/technical-selectors';

const Timer = () => {
  const activeBtn = useSelector(getActiveBtn);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const [time, setTime] = useState(0);
  const [prevActivBtn, setPrevActiveBtn] = useState(activeBtn);

  useEffect(() => {
    let interval = null;
    if (activeBtn === 'record' && deepgramStatus) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
      setPrevActiveBtn(activeBtn);
    } else if (activeBtn === 'record' && prevActivBtn === 'stop') {
      setTime(0);
    }

    setPrevActiveBtn(activeBtn);
    return () => clearInterval(interval);
  }, [activeBtn, deepgramStatus, prevActivBtn]);

  const formatTime = totalSeconds => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0'
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-[90px] h-[40px] flex items-center justify-center">
      <p className="text-[14px] font-normal text-black text-center">
        {formatTime(time)}
      </p>
    </div>
  );
};

export default Timer;
