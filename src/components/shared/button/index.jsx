'use client';

import React from 'react';
import Text from '../text/text';
import Image from 'next/image';

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

  return (
    <button
      id={id}
      className={btnClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
    >
      <div className="flex flex-row items-center justify-center gap-2.5 mt-[-2px]">
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
