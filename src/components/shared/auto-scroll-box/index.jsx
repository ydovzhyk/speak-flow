'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Text from '../text/text';
import { IoCopyOutline } from 'react-icons/io5';
import { MdOpenInFull } from 'react-icons/md';
import LoaderDots from '../loader-dots';
import PanelActionButton from '../panel-action-button';

const AutoScrollBox = ({
  text,
  placeholder = '',
  height = '100%',
  className = '',
  showCopy = true,
  showExpand = false,
  onExpand,
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
    if (!stickToBottomRef.current) return;

    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ block: 'end' });
    });
  }, [text, trailingLoading]);

  useEffect(() => {
    const onVisible = () => {
      if (!document || document.visibilityState !== 'visible') return;
      if (stickToBottomRef.current) {
        endRef.current?.scrollIntoView({ block: 'end' });
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
        <PanelActionButton
          onClick={handleCopy}
          disabled={!hasText}
          ariaLabel="Copy text"
          className="top-2 right-2"
        >
          <IoCopyOutline size={16} color="#017683" />
        </PanelActionButton>
      )}

      {showExpand && (
        <PanelActionButton
          onClick={onExpand}
          ariaLabel="Expand panel"
          className="bottom-2 right-2"
        >
          <MdOpenInFull size={16} color="#017683" />
        </PanelActionButton>
      )}

      <div
        className={`pointer-events-none absolute bottom-2 left-2 rounded-md px-2 py-1 bg-black/70 text-white transition-opacity ${
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
