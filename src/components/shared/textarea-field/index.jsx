'use client';

import { useState } from 'react';
import Text from '@/components/shared/text/text';

const TextareaField = ({
  label,
  name,
  register,
  required,
  validation = {},
  maxLength,
}) => {
  const [count, setCount] = useState(0);

  const finalMaxLength = maxLength ?? validation.maxLength ?? 1000;

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
        {...register(name, {
          required,
          ...validation,
          onChange: e => setCount(e.target.value.length),
        })}
        className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
        rows="4"
        maxLength={finalMaxLength}
        required={required}
      />

      <div className="text-xs text-right text-gray-500">
        {count}/{finalMaxLength} characters
      </div>
    </div>
  );
};

export default TextareaField;
