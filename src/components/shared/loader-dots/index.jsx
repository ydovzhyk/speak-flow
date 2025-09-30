
'use client';

import Text from '../text/text';

export default function LoaderDots({ label = 'Listening…' }) {
  return (
    <span className="inline-flex items-center gap-2 text-gray-600">
      <Text type="small" as="span" fontWeight="light" className="text-gray-600">
        {label}
      </Text>
      <span className="dot">.</span>
      <span className="dot d2">.</span>
      <span className="dot d3">.</span>
      <style jsx>{`
        .dot {
          animation: blink 1.4s infinite;
        }
        .dot.d2 {
          animation-delay: 0.2s;
        }
        .dot.d3 {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
