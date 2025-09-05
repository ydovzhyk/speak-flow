import Script from 'next/script';
import { Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { StoreProvider } from '@/redux/store-provider';
import { LanguageProvider } from '@/utils/translating/language-context';
import ClientLayout from './client-layout';
import GaPageviews from '@/utils/GaPageviews';
import '../app/css/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});
export const metadata = {};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          <LanguageProvider>
            {/* gtag.js */}
            {/* <Script src={https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}} strategy="afterInteractive" /> <Script id="ga4-init" strategy="afterInteractive"> { window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false }); } </Script> */}
            <Suspense fallback={null}>
              <GaPageviews />
            </Suspense>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </StoreProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
