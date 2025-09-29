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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const metadata = {
  metadataBase: new URL('https://speakflow.space'),
  title: {
    default: 'SpeakFlow — Live Speech Translation & Transcription',
    template: '%s | SpeakFlow',
  },
  description:
    'SpeakFlow — a lightweight tool for live speech transcription and instant translation. Record, transcribe, translate, and save your sessions in one place.',
  openGraph: {
    title: 'SpeakFlow — Live Speech Translation & Transcription',
    description:
      'Transcribe speech in real time and get instant translations. Simple UI, fast results, and saved records when you need them.',
    url: 'https://speakflow.space/',
    siteName: 'SpeakFlow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SpeakFlow — live transcription & translation interface',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpeakFlow — Live Speech Translation & Transcription',
    description:
      'Real-time transcription and instant translation in a clean, single-page app.',
    images: ['/og-image.png'],
  },
  keywords: [
    'SpeakFlow',
    'speech to text',
    'live transcription',
    'real-time translation',
    'AI transcription',
    'voice translator',
    'speech translator',
    'transcribe audio',
    'subtitle generator',
    'meeting notes',
    'транскрипція мови',
    'переклад мовлення',
    'онлайн транскрипція',
    'перекладач голосу',
    'розпізнавання мовлення',
  ],
  authors: [{ name: 'Yuriy Dovzhyk', url: 'https://speakflow.space' }],
  alternates: { canonical: 'https://speakflow.space/' },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          <LanguageProvider>
            {/* gtag.js */}
            {GA_ID && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                  strategy="afterInteractive"
                />
                <Script id="ga4-init" strategy="afterInteractive">
                  {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
                </Script>
              </>
            )}
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
