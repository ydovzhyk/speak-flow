'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Text from '../text/text';
import { IoCopyOutline } from 'react-icons/io5';
import LoaderDots from '../loader-dots';

/**
 * Renders sentence segments as interactive spans.
 * Hover/click activates a shared id so the paired panel can highlight + scroll.
 */
const LinkedScrollBox = ({
  segments = [],
  activeId = null,
  onActivate,
  placeholder = '',
  height = '100%',
  className = '',
  showCopy = true,
  trailingLoading = false,
  trailingLabel = 'Listening…',
}) => {
  const boxRef = useRef(null);
  const endRef = useRef(null);
  const spanRefs = useRef(new Map());
  const stickToBottomRef = useRef(true);
  const [copied, setCopied] = useState(false);

  const hasText = Array.isArray(segments) && segments.some(s => s?.text?.trim());

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  };

  useLayoutEffect(() => {
    if (!stickToBottomRef.current || activeId) return;
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ block: 'end' });
    });
  }, [segments, trailingLoading, activeId]);

  useEffect(() => {
    if (!activeId) return;
    const node = spanRefs.current.get(String(activeId));
    if (!node) return;

    stickToBottomRef.current = false;
    node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeId, segments]);

  const handleCopy = async () => {
    if (!hasText) return;
    const text = segments
      .map(s => s?.text || '')
      .filter(Boolean)
      .join(' ');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Clipboard API not available:', err);
    }
  };

  const setSpanRef = (id, node) => {
    if (!id) return;
    if (node) spanRefs.current.set(String(id), node);
    else spanRefs.current.delete(String(id));
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
            {segments.map((seg, index) => {
              const id = seg?.id ? String(seg.id) : '';
              const text = String(seg?.text || '').trim();
              if (!text) return null;

              const isActive = id && activeId != null && String(activeId) === id;
              const space = index > 0 ? ' ' : '';

              if (!id) {
                return (
                  <span key={`plain-${index}`}>
                    {space}
                    {text}
                  </span>
                );
              }

              return (
                <span key={id}>
                  {space}
                  <span
                    ref={node => setSpanRef(id, node)}
                    data-segment-id={id}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => onActivate?.(id)}
                    onFocus={() => onActivate?.(id)}
                    onClick={() => onActivate?.(id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onActivate?.(id);
                      }
                    }}
                    className={`rounded-sm cursor-pointer transition-colors duration-150 ${
                      isActive
                        ? 'bg-[var(--accent1)]/35 outline outline-1 outline-[var(--accent1)]'
                        : 'hover:bg-[var(--accent2)]/15'
                    }`}
                  >
                    {text}
                  </span>
                </span>
              );
            })}
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

export default LinkedScrollBox;
