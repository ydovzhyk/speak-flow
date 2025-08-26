import Link from 'next/link';
import Image from 'next/image';

const Logo = ({ width = 130, variant = 'color' }) => {
  const aspectRatio = 7.32 / 24.46;
  const height = width * aspectRatio;

  const logoSrc =
    variant === 'white' ? '/images/logo.svg' : '/images/color-logo.svg';

  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src={logoSrc}
        alt="Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;
