'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getActiveBtn } from '@/redux/technical/technical-selectors';

const Timer = () => {
  const activeBtn = useSelector(getActiveBtn);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (activeBtn === 'stop') {
      setTime(0);
      return;
    }

    if (activeBtn !== 'record') return;

    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBtn]);

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
