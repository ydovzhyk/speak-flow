'use client';

const RetroPlayerButton = ({
  onClick,
  disabled = false,
  pressed = false,
  wide = false,
  utility = false,
  ariaLabel,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={pressed || undefined}
      disabled={disabled}
      onClick={onClick}
      className={[
        'retro-player-btn',
        wide ? 'retro-player-btn--wide' : '',
        utility ? 'retro-player-btn--utility' : '',
        pressed ? 'retro-player-btn--pressed' : '',
        disabled ? 'retro-player-btn--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};

export default RetroPlayerButton;
