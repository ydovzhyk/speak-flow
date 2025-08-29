'use client';

import { useEffect, useRef } from 'react';

const AutoScrollBox = ({
  text,
  placeholder = '',
  height = '100%',
  className = '',
}) => {
  const boxRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  };

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [text]);

  return (
    <div
      ref={boxRef}
      onScroll={onScroll}
      className={[
        'border border-[var(--accent2)] rounded-md p-2 text-[14px] leading-6',
        'whitespace-pre-wrap break-words overflow-y-auto thin-scrollbar',
        className,
      ].join(' ')}
      style={{ height }}
    >
      {text ? text : <span className="text-gray-600">{placeholder}</span>}
    </div>
  );
}

export default AutoScrollBox;