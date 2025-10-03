import Link from 'next/link';
import Image from 'next/image';

const Logo = ({
  variant = 'color',
  asLink = true,
  eager = false,
  width = 250,
  height = 89,
}) => {
  const logoSrc =
    variant === 'white'
      ? '/images/logo.svg'
      : variant === 'clear'
        ? '/images/clear-logo.svg'
        : '/images/color-logo.svg';

  const common = {
    src: logoSrc,
    alt: 'Logo',
    width: !asLink ? 125 : width,
    height: !asLink ? 37 : height,
    className: 'object-contain h-auto',
    loading: eager ? 'eager' : 'lazy',
    fetchPriority: eager ? 'high' : undefined,
  };

  return asLink ? (
    <Link href="/" aria-label="Home">
      <Image {...common} />
    </Link>
  ) : (
    <Image {...common} />
  );
};

export default Logo;
