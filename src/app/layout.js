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

const SITE_URL = 'https://speakflow.art';
const SITE_NAME = 'SpeakFlow';
const DEFAULT_TITLE =
  'SpeakFlow - Live Transcription & Translation for Voice, Meetings & Videos';
const DEFAULT_DESCRIPTION =
  'Transcribe and translate live: your microphone, Google Meet colleagues, YouTube, movies, and more. Desktop captures voice and computer audio; on mobile use your mic as a live travel translator.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SpeakFlow - live speech transcription and translation',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description:
      'Live speech-to-text and translation for your voice and anything your computer plays - meetings, YouTube, films. Mic-only live translator on mobile.',
    images: ['/og-image.png'],
  },
  keywords: [
    'SpeakFlow',
    'live transcription',
    'real-time translation',
    'speech to text',
    'live speech translator',
    'Google Meet translation',
    'meeting translation',
    'YouTube transcription',
    'translate computer audio',
    'tab audio transcription',
    'voice translator',
    'travel voice translator',
    'AI transcription',
    'AI translation',
    'live captions',
    'транскрипція мови',
    'переклад зустрічей',
    'переклад Google Meet',
    'переклад з YouTube',
    'живий перекладач',
    'розпізнавання мовлення',
    'перекладач голосу',
  ],
  authors: [{ name: 'Yuriy Dovzhyk', url: SITE_URL }],
  creator: 'Yuriy Dovzhyk',
  publisher: SITE_NAME,
  category: 'technology',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
