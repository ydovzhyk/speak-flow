'use client';

import React from 'react';
import Text from '../text/text';
import Image from 'next/image';

const Button = ({
  text = '',
  type = 'submit',
  btnClass = 'btnDark',
  textColor = 'text-black',
  onClick,
  id = '',
  image = null,
  disabled = false,
  width = '170px',
}) => {
  const baseClasses =
    'flex items-center justify-center group w-[150px] h-[40px] md:w-[170px]';
  const btnDarkClasses = `${baseClasses} regular-border hover-transition hover:shadow-md hover:bg-[var(--accent1)] hover:border-[var(--accent1)] rounded-[5px] cursor-pointer group`;
  const btnLightClasses = `${baseClasses} hover:shadow-md transition-shadow duration-300 regular-border bg-transparent hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white`;
  const btnPlainClasses =
    'underline decoration-transparent underline-offset-2 hover:decoration-[var(--accent)] transition-all duration-300';
  const btnDisabledClasses =
    'bg-text-color border border-text-color text-main-color cursor-not-allowed';


  let buttonClasses = '';
  let textClasses = '';

  if (disabled) {
    buttonClasses = btnDisabledClasses;
  } else if (btnClass === 'btnDark') {
    buttonClasses = btnDarkClasses;
    textClasses = 'text-black group-hover:text-white';
  } else if (btnClass === 'btnLight') {
    buttonClasses = btnLightClasses;
    textClasses = 'text-black group-hover:text-white';
  } else if (btnClass === 'btnPlain') {
    buttonClasses = btnPlainClasses;
    textClasses = 'font-semibold text-[#017683]';
  }

  return (
    <button
      id={id}
      className={`${baseClasses} ${buttonClasses}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{ width, borderRadius: '5px' }}
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
            className={`${textColor} hover-transition duration-300 ${textClasses}`}
          >
            {text}
          </Text>
        )}
      </div>
    </button>
  );
};

export default Button;
