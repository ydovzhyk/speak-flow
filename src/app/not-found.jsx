'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Text from '@/components/shared/text/text';

export default function NotFound() {
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const onResize = () => setAfterMobileHeader(window.innerWidth > 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const topOffset = useMemo(
    () => (afterMobileHeader ? 148 : 85),
    [afterMobileHeader]
  );

  return (
    <section
      className="w-full h-full relative bg-center bg-no-repeat bg-cover"
      style={{
        paddingTop: `${topOffset}px`,
        height: `calc(100dvh - ${topOffset}px)`,
        backgroundImage: 'url(/images/404-bg.webp)',
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <div className="absolute inset-0 flex flex-row items-center justify-center">
        <div className="container relative flex flex-col gap-12 items-center">
          <div className="flex flex-col items-center gap-5">
            <Text
              type="xxl"
              as="p"
              fontWeight="semibold"
              className="text-[#FAFCFF]"
              textShadow="black"
              noTranslate={true}
            >
              404
            </Text>
            <Text
              type="xxl"
              as="h1"
              fontWeight="semibold"
              className="text-[#FAFCFF]"
              textShadow="black"
            >
              Page Not Found
            </Text>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center">
            <div className="w-[100%] sm:w-[40%]"></div>
            <div className="w-[80%] sm:w-[60%] flex flex-col items-center justify-center gap-3">
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-[#FAFCFF]"
                textShadow="black"
              >
                Hi, this page is on vacation.
              </Text>
              <Text
                type="banner"
                as="p"
                fontWeight="light"
                className="text-[#FAFCFF]"
                textShadow="black"
              >
                You should be too.
              </Text>

              <div className="text-center">
                <Text
                  type="tiny"
                  as="span"
                  fontWeight="light"
                  className="text-[#FAFCFF]"
                  textShadow="black"
                >
                  But don&apos;t worry, you can find your way back to my{' '}
                </Text>
                <Link
                  href="/"
                  className="border-b border-[#FAFCFF] hover:border-[var(--accent)] w-fit transition-colors duration-200 lowercase"
                  aria-label="Go to homepage"
                >
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[#FAFCFF]"
                    textShadow="black"
                  >
                    site.
                  </Text>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
