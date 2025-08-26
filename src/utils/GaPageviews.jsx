'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GaPageviews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrlRef = useRef('');

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    if (lastUrlRef.current === url) return;
    lastUrlRef.current = url;

    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    });
  }, [pathname, searchParams]);

  return null;
}
