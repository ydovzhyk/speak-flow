'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import Text from '@/components/shared/text/text';
import Logo from '@/components/shared/logo/logo';
import { getScreenType } from '@/redux/technical/technical-selectors';

export default function NotFound() {
  const screenType = useSelector(getScreenType);

  return (
    <section
      className="w-full h-full relative bg-center bg-no-repeat bg-cover"
      style={{
        height: `100dvh`,
        backgroundImage: 'url(/images/bg.webp)',
      }}
    >
      {screenType === 'isDesktop' && (
        <div className="absolute top-[20px] left-[50px]">
          <Logo width={250} variant="color" />
        </div>
      )}

      <div className="absolute inset-0 flex flex-row items-center justify-center">
        <div className="container relative flex flex-col gap-[70px] items-center">
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
                  className="border-b border-[#FAFCFF] hover:border-[var(--accent1)] w-fit transition-colors duration-200 lowercase"
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
