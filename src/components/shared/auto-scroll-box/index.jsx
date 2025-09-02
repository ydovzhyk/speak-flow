'use client';

import { useEffect, useRef, useState } from 'react';
import Text from '../text/text';
import { IoCopyOutline } from 'react-icons/io5';

const AutoScrollBox = ({
  text,
  placeholder = '',
  height = '100%',
  className = '',
  showCopy = true,
}) => {
  const boxRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const [copied, setCopied] = useState(false);
  const hasText = !!text && String(text).trim().length > 0;

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

  const handleCopy = async () => {
    if (!hasText) return;
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Clipboard API not available:', err);
    }
  };


  return (
    <div className="relative" style={{ height }}>
      <div
        ref={boxRef}
        onScroll={onScroll}
        className={`border border-[var(--accent2)] rounded-md p-2 text-[14px] leading-6 whitespace-pre-wrap break-words overflow-y-auto thin-scrollbar h-full ${className}`}
      >
        {hasText ? (
          text
        ) : (
          <Text
            type="tiny"
            as="span"
            fontWeight="light"
            className="text-gray-600"
          >
            {placeholder}
          </Text>
        )}
      </div>

      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          disabled={!hasText}
          aria-label="Copy text"
          className="absolute top-2 right-2 rounded-full w-8 h-8 backdrop-blur border border-gray-400 shadow bg-white/30 hover:bg-white/70 disabled:opacity-20 flex items-center justify-center transition-opacity outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <IoCopyOutline size={18} color="#017683" />
        </button>
      )}

      <div
        className={`pointer-events-none absolute bottom-2 right-2 rounded-md px-2 py-1 bg-black/70 text-white transition-opacity
        ${copied ? 'opacity-100' : 'opacity-0'}`}
      >
        <Text type="tiny" as="span" fontWeight="normal">
          Copied!
        </Text>
      </div>
    </div>
  );
};

export default AutoScrollBox;
