import Link from 'next/link';

const SITE_URL = 'https://speakflow.art';

export const metadata = {
  title: 'How SpeakFlow Works',
  description:
    'How to use SpeakFlow for live transcription and translation: your microphone, Google Meet tab audio, YouTube, movies on desktop, and mic-only travel mode on mobile.',
  alternates: {
    canonical: `${SITE_URL}/how-it-works`,
  },
  openGraph: {
    title: 'How SpeakFlow Works',
    description:
      'Step-by-step: capture your voice and computer audio for live transcript and translation — meetings, YouTube, films, and travel.',
    url: `${SITE_URL}/how-it-works`,
    siteName: 'SpeakFlow',
    type: 'article',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SpeakFlow — how it works',
      },
    ],
  },
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to use SpeakFlow for live transcription and translation',
  description:
    'Capture microphone and computer audio to get live transcripts and translations.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Open SpeakFlow',
      text: 'Go to speakflow.art. The tool is in the center of the page.',
    },
    {
      '@type': 'HowToStep',
      name: 'Choose languages and audio source',
      text: 'In SETTINGS set transcription language, translation language, and Microphone, Speaker, or Auto.',
    },
    {
      '@type': 'HowToStep',
      name: 'For meetings or videos on desktop',
      text: 'Start the meeting or open the YouTube/movie tab first. Press Record, choose Chrome Tab, select that tab, enable Share tab audio, then Share.',
    },
    {
      '@type': 'HowToStep',
      name: 'For voice only or mobile',
      text: 'Allow microphone access and speak or point the phone at the speaker. Read the live transcript and translation.',
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen w-full bg-[#0b3d44] text-[#e8f4f5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-5 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-[#7fd4de] hover:text-white w-fit"
          >
            ← Back to SpeakFlow tool
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            How SpeakFlow works
          </h1>
          <p className="text-[16px] leading-7 text-[#c5e0e4]">
            SpeakFlow is a live speech companion: it transcribes what it hears
            and translates it instantly. On a computer that can be{' '}
            <strong className="text-white">your voice</strong> and{' '}
            <strong className="text-white">
              anything playing through a shared browser tab
            </strong>{' '}
            — meetings, YouTube, movies. On a phone it uses the microphone as a
            live translator when you travel or talk to people around you.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium text-white">
            1. The tool in the center
          </h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Open{' '}
            <Link href="/" className="text-white underline underline-offset-2">
              speakflow.art
            </Link>
            . You land straight on the tool — no extra dashboard. Set languages
            in SETTINGS, press Record, and watch Transcript and Translation
            fill in live. Hover a sentence to highlight its pair.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium text-white">
            2. Desktop: microphone + computer audio
          </h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            <strong className="text-white">Microphone</strong> captures what you
            say in a call or while dictating.{' '}
            <strong className="text-white">Speaker / tab audio</strong> captures
            what your computer plays. <strong className="text-white">Auto</strong>{' '}
            switches between them.
          </p>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            For Google Meet or another browser meeting: join the call first,
            keep that tab open, open SpeakFlow in another tab, press Record,
            choose <strong className="text-white">Chrome Tab</strong>, select
            the meeting tab, enable{' '}
            <strong className="text-white">Share tab audio</strong>, then Share.
            Prefer a tab over Entire Screen for reliable meeting audio.
          </p>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            The same tab-share flow works for YouTube and many browser-based
            players when you want live captions and translation of what you are
            watching.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium text-white">
            3. Mobile: microphone travel mode
          </h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Mobile browsers cannot share system audio. Use the microphone
            instead: when someone explains directions in another language, or
            you need to follow a conversation nearby, open SpeakFlow, allow the
            mic, and read the live transcript and translation.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium text-white">
            4. Why it exists
          </h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            SpeakFlow grew out of real international teamwork — keeping up when
            meetings and content move quickly in another language. The goal is
            simple: make foreign speech readable in the moment, whether it comes
            from your mic or from your computer speakers.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium text-white">5. Save sessions</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Sign in to save transcript and translation, reopen them later with
            the same linked sentence highlighting, and search your records.
          </p>
        </section>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-[#017683] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0299b5] transition-colors"
          >
            Open the SpeakFlow tool
          </Link>
        </div>
      </div>
    </div>
  );
}
