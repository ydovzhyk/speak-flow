'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Text from '../text/text';
import { IoCopyOutline } from 'react-icons/io5';
import { MdOpenInFull } from 'react-icons/md';
import LoaderDots from '../loader-dots';
import PanelActionButton from '../panel-action-button';

/** Scroll a child into view inside `box` only - never touch ancestor scrollers. */
const scrollChildIntoBox = (box, node, { block = 'nearest', smooth = false } = {}) => {
  if (!box || !node) return;

  const boxRect = box.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const behavior = smooth ? 'smooth' : 'auto';

  if (block === 'start') {
    box.scrollBy({
      top: nodeRect.top - boxRect.top - 8,
      behavior,
    });
    return;
  }

  if (nodeRect.top < boxRect.top + 8) {
    box.scrollBy({
      top: nodeRect.top - boxRect.top - 8,
      behavior,
    });
  } else if (nodeRect.bottom > boxRect.bottom - 8) {
    box.scrollBy({
      top: nodeRect.bottom - boxRect.bottom + 8,
      behavior,
    });
  }
};

/**
 * Renders sentence segments as interactive spans.
 * Hover/click activates a shared id so the paired panel can highlight + scroll.
 * While followLive + stuck to bottom, new sentences auto-scroll into view.
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
  followLive = true,
}) => {
  const boxRef = useRef(null);
  const endRef = useRef(null);
  const spanRefs = useRef(new Map());
  const stickToBottomRef = useRef(followLive);
  const prevCountRef = useRef(0);
  const [copied, setCopied] = useState(false);

  const hasText = Array.isArray(segments) && segments.some(s => s?.text?.trim());

  useEffect(() => {
    // Saved-record view must not start in "stick to bottom" mode.
    if (!followLive) stickToBottomRef.current = false;
  }, [followLive]);

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  };

  // Live follow: only when a NEW sentence arrives and user is stuck to bottom.
  // Do not run on trailingLoading alone - that was yanking scroll after Stop.
  useLayoutEffect(() => {
    const usable = Array.isArray(segments)
      ? segments.filter(s => s?.text?.trim())
      : [];
    const count = usable.length;
    const grew = count > prevCountRef.current;
    prevCountRef.current = count;

    if (!followLive || !grew || !stickToBottomRef.current) return;

    const box = boxRef.current;
    requestAnimationFrame(() => {
      if (!box) return;
      const last = usable[count - 1];
      const node = last?.id ? spanRefs.current.get(String(last.id)) : null;
      if (node) {
        scrollChildIntoBox(box, node, { block: 'start' });
      } else {
        box.scrollTop = box.scrollHeight;
      }
    });
  }, [segments, followLive]);

  // Pair sync: scroll only this box to the active sentence.
  useEffect(() => {
    if (!activeId) return;

    // Hover/click means the user is browsing - pause live stick-to-bottom.
    stickToBottomRef.current = false;

    const run = () => {
      const node = spanRefs.current.get(String(activeId));
      const box = boxRef.current;
      if (!node || !box) return false;
      scrollChildIntoBox(box, node, { block: 'nearest', smooth: true });
      return true;
    };

    // First paint may not have laid out yet - retry briefly.
    if (run()) return undefined;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (run() || tries >= 10) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, [activeId]);

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
