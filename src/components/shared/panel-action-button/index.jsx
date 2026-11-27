'use client';

const SIZE_CLASS = 'w-8 h-8'; // ~20% smaller than previous w-10 h-10

const PanelActionButton = ({
  onClick,
  disabled = false,
  ariaLabel,
  className = '',
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`absolute ${SIZE_CLASS} rounded-full backdrop-blur-[2px] bg-white/30 border border-gray-400 hover:bg-white/70 disabled:opacity-20 flex items-center justify-center transition-opacity outline-none focus:ring-2 focus:ring-[var(--accent2)] ${className}`}
  >
    {children}
  </button>
);

export default PanelActionButton;
