'use client';
import { useEffect } from 'react';

export default function GaPageviews() {
  useEffect(() => {
    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: '/',
    });
  }, []);

  return null;
}
