'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Text from '../text/text';

const BackLink = () => {
  const searchParams = useSearchParams();
  const backLinkHref = searchParams.get('from') || '/';

  return (
    <Link href={backLinkHref} passHref className="cursor-pointer group">
      <button
        className="cursor-pointer underline decoration-transparent marker:underline-offset-2 hover:decoration-[#00f] transition-all duration-300"
        type="button"
      >
        <Text
          type="tiny"
          as="span"
          fontWeight="normal"
          lineHeightValues="none"
          className="text-[#00f]"
        >
          Go to main page
        </Text>
        </button>
    </Link>
  );
};

export default BackLink;
