'use client';

import { useEffect, useState } from 'react';

const LogoWave = ({
  bars = 10,
  tickMs = 130,
  stepPx = 3,
  maxUpIndex = 5,
  barWidthPx = 1,
  gapPx = 2,
  color = '#0299B5',
}) => {

  const [shift, setShift] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setShift(prev => (prev + 1) % bars);
    }, tickMs);
    return () => clearInterval(id);
  }, [bars, tickMs]);

  const items = [];
  for (let i = 0; i < bars; i++) {
    const index = (i + shift) % bars;
    const height =
      index <= maxUpIndex ? (index + 1) * stepPx : (bars - index) * stepPx;

    items.push(
      <div
        key={i}
        className="animate-wave"
        style={{
          width: `${barWidthPx}px`,
          height: `${height}px`,
          marginLeft: `${i === 0 ? 0 : gapPx / 2}px`,
          marginRight: `${i === bars - 1 ? 0 : gapPx / 2}px`,
          backgroundColor: color,
          animationDelay: `${-i * 0.1}s`,
        }}
      />
    );
  }

  return (
    <div className="flex flex-row items-center gap-1">
      <div className="flex items-center">{items}</div>
    </div>
  );
};
export default LogoWave;
