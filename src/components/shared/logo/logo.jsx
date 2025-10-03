'use client';

import Link from 'next/link';
import Image from 'next/image';

const Logo = ({ variant = 'color', asLink = true }) => {

  const logoSrc =
    variant === 'white' ? '/images/logo.svg' : variant === 'clear' ? '/images/clear-logo.svg' : '/images/color-logo.svg';

  return (
    <>
      {asLink ? (
        <Link href="/" aria-label="Home">
          <Image
            src={logoSrc}
            alt="Logo"
            width={250}
            height={89}
            className="object-contain h-auto"
          />
        </Link>
      ) : (
        <Image
          src={logoSrc}
          alt="Logo"
          width={125}
          height={37}
          className="object-contain"
          unoptimized
        />
      )}
    </>
  );
};

export default Logo;
