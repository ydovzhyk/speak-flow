'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import Text from '../text/text';

const TextField = forwardRef(
  (
    {
      type = 'text',
      name,
      value,
      handleChange,
      placeholder,
      required,
      title,
      className,
      error,
      autoComplete,
      icon,
    },
    ref
  ) => {
    const labelBase =
      'relative inline-block w-full h-[35px] text-[var(--text-main)]';
    const inputBase =
      'absolute top-0 left-0 pl-[10px] w-full h-[40px] font-normal text-[14px] leading-none regular-border border-opacity-50 rounded-[5px] tracking-[1px] transition-all duration-300 ease-in-out outline-none bg-transparent';
    const emptyInputClass = 'regular-border border-opacity-50 outline-none';

    const labelClass = clsx(labelBase, className);
    const inputClass = clsx(inputBase, className);

    return (
      <label className={labelClass}>
        <input
          ref={ref}
          className={value ? clsx(inputBase, emptyInputClass) : inputClass}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          title={title}
          autoComplete={autoComplete}
        />
        {value ? (
          <div className="absolute top-[-22px] left-0.2 flex flex-row items-center gap-[10px]">
            <Text type="tiny" as="span" fontWeight="normal">
              {placeholder}
            </Text>
            {icon && (
              <div className="relative w-[40px] flex items-center justify-center">
                <div className="absolute top-[-19px] left-0">{icon}</div>
              </div>
            )}
          </div>
        ) : (
          <Text
            type="tiny"
            as="span"
            fontWeight="normal"
            className="absolute top-[11px] left-0.25 ml-2.5"
          >
            {placeholder}
          </Text>
        )}
        {error && (
          <Text
            type="extraSmall"
            as="span"
            fontWeight="normal"
            className="absolute top-10 text-red-500"
          >
            {error.message || title || ''}
          </Text>
        )}
      </label>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
