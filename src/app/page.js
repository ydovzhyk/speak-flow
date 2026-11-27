import HomeClient from './home-client';

const SITE_URL = 'https://speakflow.art';

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SpeakFlow',
  url: SITE_URL,
  description:
    'SpeakFlow provides live speech transcription and AI translation for your microphone and for audio playing on your computer — meetings, YouTube, movies — plus a mic-based live translator on mobile.',
  applicationCategory: 'MultimediaApplication',
  applicationSubCategory: 'Speech translation',
  operatingSystem: 'Web Browser',
  browserRequirements:
    'Requires JavaScript. Chrome or Edge recommended for tab audio capture on desktop.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Yuriy Dovzhyk',
    url: SITE_URL,
  },
  featureList: [
    'Live speech-to-text transcription',
    'Real-time AI translation',
    'Microphone capture on desktop and mobile',
    'Browser tab audio capture for meetings and media (desktop)',
    'Google Meet / Zoom web / Teams companion mode',
    'YouTube and movie audio transcription',
    'Linked transcript and translation highlighting',
    'Saved transcription records',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can SpeakFlow translate Google Meet or other online meetings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Join the meeting first, open SpeakFlow in another tab, press Record, and share that meeting Chrome tab with “Share tab audio” enabled. SpeakFlow will transcribe and translate what you hear from colleagues.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can SpeakFlow transcribe YouTube videos or movies on my computer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes on desktop. Share the browser tab (or media tab) with tab audio so SpeakFlow can capture what is playing, then get a live transcript and translation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SpeakFlow work on phones?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes for microphone input. Mobile browsers cannot share system or tab audio, but you can still use SpeakFlow as a live travel translator when people speak near your phone.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the microphone work on desktop too?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Desktop supports microphone, shared tab/speaker audio, and Auto mode that switches between them during one session.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Crawlable copy without taking layout space — keeps the tool compact when tiling */}
      <section className="sr-only" aria-label="About SpeakFlow">
        <h1>
          SpeakFlow — Live transcription and translation for your voice and
          your computer
        </h1>
        <p>
          Transcribe and translate live from your microphone and from audio
          playing on your computer — Google Meet, YouTube, movies, and more. On
          mobile, use the microphone as a live travel translator. Read the full
          guide at {SITE_URL}/how-it-works.
        </p>
      </section>

      <HomeClient />
    </>
  );
}
