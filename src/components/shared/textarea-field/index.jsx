'use client';

import { useEffect, useState } from 'react';
import Text from '@/components/shared/text/text';

const TextareaField = ({
  label,
  name = 'textarea',
  register,
  required,
  validation = {},
  maxLength,
  readOnly = false,
  value = '',
  placeholder = '',
  rows = 4,
  className = '',
  showCounter = true, // ← можна вимкнути лічильник
}) => {
  const limit =
    typeof maxLength === 'number'
      ? maxLength
      : typeof validation?.maxLength === 'number'
        ? validation.maxLength
        : null;

  const [count, setCount] = useState((value || '').length);

  useEffect(() => {
    setCount((value || '').length);
  }, [value]);

  const baseClasses = `
    bg-white w-full rounded-md regular-border border-opacity-50 outline-none
    px-3 py-2 font-normal text-[14px] overflow-y-auto thin-scrollbar ${className}
  `;
  const textAreaProps = readOnly
    ? { value }
    : register
      ? register(name, {
          required,
          ...validation,
          onChange: e => setCount(e.target.value.length),
        })
      : {
          onChange: e => setCount(e.target.value.length),
        };

  return (
    <div className="flex flex-col gap-1">
      <label>
        <Text
          type="tiny"
          as="span"
          fontWeight="normal"
          className="text-[var(--text-main)]"
        >
          {label}
        </Text>
      </label>

      <textarea
        {...textAreaProps}
        className={baseClasses}
        rows={rows}
        {...(limit !== null ? { maxLength: limit } : {})}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
      />

      {showCounter && (
        <Text
            type="extraSmall"
            as="span"
            fontWeight="normal"
            className="text-gray-500 text-right"
          >
            {limit !== null
            ? `${count}/${limit} characters`
            : `${count} characters`}
          </Text>
      )}
    </div>
  );
};

export default TextareaField;

