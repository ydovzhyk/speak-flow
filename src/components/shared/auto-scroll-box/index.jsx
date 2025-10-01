'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Text from '../text/text';
import { IoCopyOutline } from 'react-icons/io5';
import LoaderDots from '../loader-dots';

const AutoScrollBox = ({
  text,
  placeholder = '',
  height = '100%',
  className = '',
  showCopy = true,
  trailingLoading = false,
  trailingLabel = 'Listening…',
}) => {
  const boxRef = useRef(null);
  const endRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const [copied, setCopied] = useState(false);

  const hasText = !!text && String(text).trim().length > 0;

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  };

  useLayoutEffect(() => {
    if (!boxRef.current || !endRef.current) return;
    if (stickToBottomRef.current) {
      requestAnimationFrame(() => {
        endRef.current.scrollIntoView({ block: 'end' });
      });
    }
  }, [text, trailingLoading]);

  useEffect(() => {
    const onVisible = () => {
      if (!document || document.visibilityState !== 'visible') return;
      if (stickToBottomRef.current && endRef.current) {
        endRef.current.scrollIntoView({ block: 'end' });
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

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
          <>
            {text}
            {trailingLoading && (
              <div className="mt-1">
                <LoaderDots label={trailingLabel} />
              </div>
            )}
          </>
        ) : trailingLoading ? (
          <div className="text-gray-600">
            <LoaderDots label={trailingLabel} />
          </div>
        ) : (
          <Text
            type="small"
            as="span"
            fontWeight="light"
            className="text-gray-600"
          >
            {placeholder}
          </Text>
        )}
        <div ref={endRef} />
      </div>

      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          disabled={!hasText}
          aria-label="Copy text"
          className="absolute top-2 right-2 rounded-full w-10 h-10 backdrop-blur-[2px] bg-white/30 border border-gray-400 hover:bg-white/70 disabled:opacity-20 flex items-center justify-center transition-opacity outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <IoCopyOutline size={20} color="#017683" />
        </button>
      )}

      <div
        className={`pointer-events-none absolute bottom-2 right-2 rounded-md px-2 py-1 bg-black/70 text-white transition-opacity ${
          copied ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Text type="tiny" as="span" fontWeight="normal">
          Copied!
        </Text>
      </div>
    </div>
  );
};

export default AutoScrollBox;

