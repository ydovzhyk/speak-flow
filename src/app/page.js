import HomeClient from './home-client';

const SITE_URL = 'https://speakflow.art';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SpeakFlow',
  url: SITE_URL,
  description:
    'SpeakFlow is a lightweight web app for live speech transcription and instant AI translation. Record from microphone or system audio, transcribe in real time, translate on the fly, and save your sessions.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript. Chrome, Edge, or Firefox recommended.',
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
    'Microphone and system audio capture',
    'Saved transcription records',
    'Guest and registered usage modes',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SSR SEO block — available to crawlers without opening INFO */}
      <section className="sr-only" aria-label="About SpeakFlow">
        <h1>SpeakFlow — Live Speech Translation & Transcription</h1>
        <p>
          SpeakFlow is a lightweight tool for live speech transcription and
          instant translation. Capture audio from your microphone or system
          speakers, get real-time transcripts, and translate them into your
          target language in one place.
        </p>
        <p>
          Choose input and output languages, record or pause sessions, and save
          your transcriptions for later. SpeakFlow works in modern browsers on
          desktop and mobile — ideal for meetings, interviews, language
          practice, and content review.
        </p>
      </section>

      <HomeClient />
    </>
  );
}
