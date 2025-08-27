// AutoScrollBox.jsx
import { useEffect, useRef } from 'react';

export default function AutoScrollBox({ text, placeholder }) {
  const ref = useRef(null);
  const atBottomRef = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      atBottomRef.current = nearBottom;
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (atBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [text]);

  return (
    <div
      ref={ref}
      className="w-full h-56 border border-teal-700 rounded p-3 overflow-auto bg-white"
      style={{ lineHeight: '1.6' }}
    >
      {text ? (
        <div className="whitespace-pre-wrap text-[15px]">{text}</div>
      ) : (
        <div className="text-gray-400">{placeholder}</div>
      )}
    </div>
  );
}
