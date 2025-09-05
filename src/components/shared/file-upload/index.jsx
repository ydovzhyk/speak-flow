'use client';

import { forwardRef, useRef } from 'react';
import Text from '@/components/shared/text/text';
import Button from '@/components/shared/button';
import { toast } from 'react-toastify';

const FileUpload = forwardRef(
  (
    {
      id,
      label,
      onChange,
      error,
      single = true,
      accept = 'image/*',
      maxFiles = 1,
      maxFileSize = 500 * 1024, // 500KB
      className,
      disabled,
    },
    ref
  ) => {
    const inputRef = useRef(null);

    const handleInputChange = e => {
      const files = e.target.files;

      if (!single && files.length > maxFiles) {
        toast.error(`You can upload up to ${maxFiles} files.`);
        e.target.value = '';
        onChange?.(null);
        return;
      }

      const oversize = Array.from(files).some(file => file.size > maxFileSize);
      if (oversize) {
        toast.error(`Each file must be ≤ ${Math.round(maxFileSize / 1024)}KB.`);
        e.target.value = '';
        onChange?.(null);
        return;
      }

      onChange?.(files);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    return (
      <div className={`flex flex-col gap-2 ${className || ''}`}>
        {label && (
          <Text
            type="extraSmall"
            as="span"
            fontWeight="normal"
            className="text-gray-500 text-center"
          >
            {label}
          </Text>
        )}

        <Button
          text={single ? 'Choose Image' : 'Choose Images'}
          type="button"
          btnClass="btnDark"
          onClick={handleClick}
          disabled={disabled}
        />

        <input
          id={id}
          ref={ref || inputRef}
          type="file"
          disabled={disabled}
          accept={accept}
          multiple={!single}
          className="hidden"
          onChange={handleInputChange}
        />

        {error && (
          <Text
            type="extraSmall"
            as="span"
            fontWeight="normal"
            className="text-red-500"
          >
            {error.message || ''}
          </Text>
        )}
      </div>
    );
  }
);

export default FileUpload;

