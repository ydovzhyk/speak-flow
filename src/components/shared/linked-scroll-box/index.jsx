'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Text from '../text/text';
import { IoCopyOutline } from 'react-icons/io5';
import { MdOpenInFull } from 'react-icons/md';
import LoaderDots from '../loader-dots';
import PanelActionButton from '../panel-action-button';

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
  showExpand = false,
  onExpand,
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
    const box = boxRef.current;
    if (!node || !box) return;

    stickToBottomRef.current = false;

    const boxRect = box.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    if (nodeRect.top < boxRect.top + 8) {
      box.scrollBy({
        top: nodeRect.top - boxRect.top - 8,
        behavior: 'smooth',
      });
    } else if (nodeRect.bottom > boxRect.bottom - 8) {
      box.scrollBy({
        top: nodeRect.bottom - boxRect.bottom + 8,
        behavior: 'smooth',
      });
    }
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
                    className="cursor-pointer transition-colors duration-150 px-1 py-0.5 rounded-md [box-decoration-break:clone] [-webkit-box-decoration-break:clone] hover:bg-[#017683]/20"
                    style={
                      isActive
                        ? {
                            backgroundColor: 'rgba(2, 153, 181, 0.28)',
                            borderRadius: '6px',
                          }
                        : undefined
                    }
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

export default LinkedScrollBox;
