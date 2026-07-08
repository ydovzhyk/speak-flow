'use client';

const iconClass = 'retro-player-btn__glyph';

export const PlayIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4.5 3v10l9-5-9-5z" fill="currentColor" />
  </svg>
);

export const PauseIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="4" y="3" width="3" height="10" rx="0.6" fill="currentColor" />
    <rect x="9" y="3" width="3" height="10" rx="0.6" fill="currentColor" />
  </svg>
);

export const StopIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="4" y="4" width="8" height="8" rx="0.8" fill="currentColor" />
  </svg>
);

export const RecIcon = ({ bright = true }) => (
  <span
    className={`retro-rec-label ${bright ? 'retro-rec-label--bright' : 'retro-rec-label--dim'}`}
    aria-hidden="true"
  >
    REC
  </span>
);

export const SaveIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3 3.5h7.2L13 6.3V12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
    />
    <rect x="5" y="3" width="4.5" height="2.6" rx="0.35" fill="currentColor" />
    <rect x="4.5" y="8" width="7" height="3.6" rx="0.45" fill="currentColor" />
  </svg>
);

export const OpenIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3.5 6.5 8 2.5 12.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.45" />
    <path d="M8 3v7.2" fill="none" stroke="currentColor" strokeWidth="1.45" />
    <path d="M3.5 12.8h9" fill="none" stroke="currentColor" strokeWidth="1.45" />
  </svg>
);

export const ClearIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 5.8h8l-1.1 7H5.1L4 5.8z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path d="M3.5 5.8h9" fill="none" stroke="currentColor" strokeWidth="1.35" />
    <path d="M6.2 3.8h3.6" fill="none" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="6" cy="3.1" r="0.65" fill="currentColor" />
    <circle cx="8" cy="2.7" r="0.65" fill="currentColor" />
    <circle cx="10" cy="3.1" r="0.65" fill="currentColor" />
  </svg>
);
