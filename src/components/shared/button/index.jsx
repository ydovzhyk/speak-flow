'use client';

import React from 'react';
import Text from '../text/text';
import Image from 'next/image';
import { gaEvent } from '@/utils/gtag';

function toGaEventName(raw = '') {
  let s = String(raw).trim().toLowerCase();
  // замінюємо все, що не буква/цифра, на _
  s = s.replace(/[^a-z0-9]+/g, '_');
  // прибрати повторювані підкреслення
  s = s.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  // має починатись з літери
  if (!/^[a-z]/.test(s)) s = `btn_${s}`;
  // максимум 40 символів
  if (s.length > 40) s = s.slice(0, 40).replace(/_+$/, '');
  // запасний варіант
  return s || 'btn_click';
}

const Button = ({
  text = '',
  type = 'button',
  btnClass = 'btnDark',
  textColor = 'text-black',
  onClick,
  id = '',
  image = null,
  disabled = false,
  width = '170px',

  // трекінг подій натискання кнопки
  trackEventName, // опційно: якщо не вказано — беремо з text
  trackEventParams = {}, // будь-які додаткові параметри
  track = true, // можна вимкнути трекінг для конкретної кнопки
}) => {
  const base = 'items-center justify-center group';
  const sized = 'w-[150px] h-[40px] md:w-[170px]';
  const roundBorder = 'regular-border rounded-[5px]';

  const dark = `flex ${sized} ${roundBorder} hover-transition hover:shadow-md hover:bg-[var(--accent1)] hover:border-[var(--accent1)] cursor-pointer`;
  const light = `flex ${sized} ${roundBorder} hover:shadow-md transition-shadow duration-300 bg-transparent hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white cursor-pointer`;
  const plain =
    'inline-flex w-auto h-auto self-start underline decoration-transparent underline-offset-2 hover:decoration-[var(--accent)] transition-all duration-300 cursor-pointer py-1';

  const disabledClasses = `flex ${sized} ${roundBorder} bg-text-color border border-text-color text-main-color cursor-not-allowed opacity-60`;

  let btnClasses = base;
  let textClasses = '';

  if (disabled) {
    btnClasses += ` ${disabledClasses}`;
  } else if (btnClass === 'btnDark') {
    btnClasses += ` ${dark}`;
    textClasses = 'text-black group-hover:text-white';
  } else if (btnClass === 'btnLight') {
    btnClasses += ` ${light}`;
    textClasses = 'text-black group-hover:text-white';
  } else if (btnClass === 'btnPlain') {
    btnClasses += ` ${plain}`;
    textClasses = 'font-semibold text-[#017683]';
  }

  const style =
    btnClass === 'btnPlain'
      ? { borderRadius: '5px' }
      : { width, borderRadius: '5px' };

  const textColorFinal = disabled ? 'text-main-color' : textColor;

  const handleClick = e => {
    if (!disabled && track) {
      const action = trackEventName || toGaEventName(text);
      gaEvent(action, {
        button_id: id || undefined,
        button_text: text || undefined,
        ...trackEventParams,
      });
    }
    onClick?.(e);
  };

  return (
    <button
      id={id}
      className={btnClasses}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      style={style}
      data-event={trackEventName || toGaEventName(text)}
    >
      <div className="flex flex-row items-center justify-center gap-2.5">
        {image && (
          <Image
            src={image}
            alt="icon"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        )}
        {text && (
          <Text
            type="tiny"
            as="span"
            fontWeight="normal"
            lineHeight="none"
            className={`${textColorFinal} hover-transition duration-300 ${textClasses}`}
          >
            {text}
          </Text>
        )}
      </div>
    </button>
  );
};

export default Button;
