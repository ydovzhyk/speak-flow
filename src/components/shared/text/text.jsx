'use client';

import clsx from 'clsx';
import { TranslatedText } from '@/utils/translating/translating';

const sizeMap = {
  xxl: 'text-[30px] sm:text-[36px] lg:text-[48px]',
  banner: 'text-[28px] sm:text-[36px]',
  title: 'text-[20px] sm:text-[30px] lg:text-[36px]',
  normal: 'text-[22px] lg:text-[24px]',
  regular: 'text-[19px] lg:text-[22px]',
  tiny: 'text-[13px] lg:text-[14px]',
  small: 'text-[12px] lg:text-[13px]',
  extraSmall: 'text-[10px] lg:text-[11px]',
};

const fontClasses = {
  josefin: 'font-josefin',
  maven: 'font-maven',
  oblik: 'font-oblik',
  fraunces: 'font-fraunces',
  urbanist: 'font-urbanist',
};

const fontWeightClasses = {
  thin: 'font-thin',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const lineHeightValues = {
  none: '1',
  tight: '1.2',
  snug: '1.3',
  normal: '1.5',
  relaxed: '1.6',
  loose: '1.7',
};

export default function Text({
  type = 'normal',
  as: Tag = 'p',
  fontFamily = 'urbanist',
  fontWeight = 'normal',
  lineHeight = 'tight',
  children,
  className,
  noTranslate = false,
  textShadow = null, // 'black' | 'white' | null
  color,
}) {
  const sizeClass = sizeMap[type] || 'text-[16px]';

  return (
    <Tag
      className={clsx(
        sizeClass,
        fontClasses[fontFamily],
        fontWeightClasses[fontWeight],
        className
      )}
      style={{
        lineHeight: lineHeightValues[lineHeight],
        color,
        ...(textShadow === 'black' && {
          textShadow: '1px 1px 1px rgba(25,25,112,.7)',
        }),
        ...(textShadow === 'white' && {
          textShadow: '1px 1px 1px rgba(255,255,255,.7)',
        }),
      }}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        noTranslate ? (
          children
        ) : (
          <TranslatedText text={String(children)} />
        )
      ) : (
        children
      )}
    </Tag>
  );
}
