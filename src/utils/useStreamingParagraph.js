import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_CHARS_PER_FRAME = 22;

export function useStreamingParagraph(charsPerFrame = DEFAULT_CHARS_PER_FRAME) {
  const [displayedText, setDisplayedText] = useState('');
  const queueRef = useRef([]);
  const typingRef = useRef(null);
  const rafRef = useRef(null);

  const step = useCallback(() => {
    if (!typingRef.current) {
      const next = queueRef.current.shift();
      if (!next) {
        rafRef.current = null;
        return;
      }
      typingRef.current = { target: next, idx: 0 };
    }

    const { target, idx } = typingRef.current;
    const nextIdx = Math.min(idx + charsPerFrame, target.length);
    const slice = target.slice(idx, nextIdx);
    const isNewSentenceStart = idx === 0;

    setDisplayedText(prev => {
      if (!prev) return slice;
      if (!isNewSentenceStart) {
        return prev + slice;
      }
      const needSpace = /[^\s]$/.test(prev) && !/^[.,!?;:]/.test(slice);
      return needSpace ? prev + ' ' + slice : prev + slice;
    });

    typingRef.current =
      nextIdx >= target.length ? null : { target, idx: nextIdx };

    rafRef.current = requestAnimationFrame(step);
  }, [charsPerFrame]);

  const enqueueSentence = useCallback(
    sentence => {
      const normalized = (sentence || '').replace(/\s+/g, ' ').trim();
      if (!normalized) return;
      queueRef.current.push(normalized);
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(step);
      }
    },
    [step]
  );

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const resume = useCallback(() => {
    if (!rafRef.current && (typingRef.current || queueRef.current.length)) {
      rafRef.current = requestAnimationFrame(step);
    }
  }, [step]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    queueRef.current = [];
    typingRef.current = null;
    setDisplayedText('');
  }, []);

  useEffect(() => {
    if (!rafRef.current && (typingRef.current || queueRef.current.length)) {
      rafRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [step]);

  return { displayedText, enqueueSentence, pause, resume, reset };
}
