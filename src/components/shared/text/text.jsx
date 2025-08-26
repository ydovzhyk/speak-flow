'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TranslatedText } from '@/utils/translating/translating';
import { getScreenType } from '@/redux/technical/technical-selectors';

const Text = ({
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
}) => {
  const screenType = useSelector(getScreenType);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const safeScreen = hydrated ? screenType : 'isMobile';

  const sizeMap = {
    xxl: {
      isMobile: 'text-[30px]',
      isTablet: 'text-[36px]',
      isLaptop: 'text-[48px]',
      isDesktop: 'text-[48px]',
    },
    banner: {
      isMobile: 'text-[28px]',
      isTablet: 'text-[36px]',
      isLaptop: 'text-[36px]',
      isDesktop: 'text-[36px]',
    },
    title: {
      isMobile: 'text-[20px]',
      isTablet: 'text-[30px]',
      isLaptop: 'text-[36px]',
      isDesktop: 'text-[36px]',
    },
    normal: {
      isMobile: 'text-[22px]',
      isTablet: 'text-[22px]',
      isLaptop: 'text-[24px]',
      isDesktop: 'text-[24px]',
    },
    regular: {
      isMobile: 'text-[19px]',
      isTablet: 'text-[19px]',
      isLaptop: 'text-[22px]',
      isDesktop: 'text-[22px]',
    },
    tiny: {
      isMobile: 'text-[13px]',
      isTablet: 'text-[13px]',
      isLaptop: 'text-[14px]',
      isDesktop: 'text-[14px]',
    },
    small: {
      isMobile: 'text-[12px]',
      isTablet: 'text-[12px]',
      isLaptop: 'text-[13px]',
      isDesktop: 'text-[13px]',
    },
    extraSmall: {
      isMobile: 'text-[10px]',
      isTablet: 'text-[10px]',
      isLaptop: 'text-[11px]',
      isDesktop: 'text-[11px]',
    },
  };

  const sizeClass =
    (sizeMap[type] && sizeMap[type][safeScreen]) || 'text-[16px]';

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
          textShadow: '1px 1px 1px rgba(25, 25, 112, 0.7)',
        }),
        ...(textShadow === 'white' && {
          textShadow: '1px 1px 1px rgba(255, 255, 255, 0.7)',
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
};

export default Text;

// 'use client';

// import clsx from 'clsx';
// import { useSelector } from 'react-redux';
// import { TranslatedText } from '@/utils/translating/translating';
// import { getScreenType } from '@/redux/technical/technical-selectors';

// const Text = ({
//   type = 'normal',
//   as: Tag = 'p',
//   fontFamily = 'urbanist',
//   fontWeight = 'normal',
//   lineHeight = 'tight',
//   children,
//   className,
//   noTranslate = false,
//   textShadow = null, // 'black' | 'white' | null
//   color,
// }) => {
//   const screenType = useSelector(getScreenType);
//   const typeClasses = {
//     xxl: 'text-[30px] sm:text-[30px] md:text-[36px] lg:text-[48px]',
//     banner: 'text-[28px] sm:text-[30px] md:text-[36px] lg:text-[36px]',
//     title: 'text-[20px] sm:text-[24px] md:text-[30px] lg:text-[36px]',
//     normal: 'text-[22px] sm:text-[22px] md:text-[24px] lg:text-[24px]',
//     regular: 'text-[20px] sm:text-[20px] md:text-[22px] lg:text-[22px]',
//     tiny: 'text-[18px] sm:text-[18px] md:text-[20px] lg:text-[20px]',
//     small: 'text-[17px] sm:text-[17px] md:text-[18px] lg:text-[18px]',
//     extraSmall: 'text-[12px]',
//   };

//   const fontClasses = {
//     josefin: 'font-josefin',
//     maven: 'font-maven',
//     oblik: 'font-oblik',
//     fraunces: 'font-fraunces',
//     urbanist: 'font-urbanist',
//   };

//   const fontWeightClasses = {
//     thin: 'font-thin',
//     light: 'font-light',
//     normal: 'font-normal',
//     medium: 'font-medium',
//     bold: 'font-bold',
//     extrabold: 'font-extrabold',
//   };

//   const lineHeightValues = {
//     none: '1',
//     tight: '1.2',
//     snug: '1.3',
//     normal: '1.5',
//     relaxed: '1.6',
//     loose: '1.7',
//   };

//   return (
//     <Tag
//       className={clsx(
//         typeClasses[type],
//         fontClasses[fontFamily],
//         fontWeightClasses[fontWeight],
//         className
//       )}
//       style={{
//         lineHeight: lineHeightValues[lineHeight],
//         color,
//         ...(textShadow === 'black' && {
//           textShadow: '2px 1px 1px rgba(0, 0, 0, 0.5)',
//         }),
//         ...(textShadow === 'white' && {
//           textShadow: '1px 1px 1px rgba(255, 255, 255, 0.7)',
//         }),
//       }}
//     >
//       {typeof children === 'string' || typeof children === 'number' ? (
//         noTranslate ? (
//           children
//         ) : (
//           <TranslatedText text={String(children)} />
//         )
//       ) : (
//         children
//       )}
//     </Tag>
//   );
// };

// export default Text;
