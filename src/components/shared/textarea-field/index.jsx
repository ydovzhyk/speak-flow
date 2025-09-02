'use client';

import { useEffect, useState } from 'react';
import Text from '@/components/shared/text/text';

const TextareaField = ({
  label,
  name = 'textarea',
  register, // з RHF: register(name, rules)
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
  // Якщо ліміт не заданий ні через prop, ні через validation — ліміту немає
  const limit =
    typeof maxLength === 'number'
      ? maxLength
      : typeof validation?.maxLength === 'number'
        ? validation.maxLength
        : null;

  const [count, setCount] = useState((value || '').length);

  useEffect(() => {
    // для readOnly або керованих значень оновлюємо лічильник при зміні value
    setCount((value || '').length);
  }, [value]);

  const baseClasses = `
    bg-white w-full rounded-md border-2 border-gray-300 outline-none
    focus:border-[var(--accent)] focus:ring-[var(--accent)]
    px-3 py-2 text-[var(--text-title)] ${className}
  `;

  // readOnly → керований режим: тільки value (onChange не потрібен)
  // editable + RHF → через register додаємо onChange для лічильника
  // editable без RHF → простий onChange, щоб оновлювати лічильник
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
    <div className="flex flex-col gap-2">
      <label>
        <Text
          type="tiny"
          as="p"
          fontWeight="light"
          className="text-[var(--text-title)]"
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
        <div className="text-xs text-right text-gray-500">
          {limit !== null
            ? `${count}/${limit} characters`
            : `${count} characters`}
        </div>
      )}
    </div>
  );
};

export default TextareaField;
