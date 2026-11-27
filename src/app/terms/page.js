import Link from 'next/link';

const SITE_URL = 'https://speakflow.art';
const UPDATED = 'November 27, 2026';

export const metadata = {
  title: 'Terms of Use',
  description:
    'Terms of Use for SpeakFlow.art — the live transcription and translation browser tool.',
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: 'SpeakFlow Terms of Use',
    description:
      'Rules for using SpeakFlow.art, an independent live speech transcription and translation tool.',
    url: `${SITE_URL}/terms`,
    siteName: 'SpeakFlow',
    type: 'article',
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#0b3d44] text-[#e8f4f5]">
      <div className="mx-auto max-w-3xl px-5 py-12 flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-sm text-[#7fd4de] hover:text-white w-fit"
          >
            ← Back to SpeakFlow tool
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Terms of Use
          </h1>
          <p className="text-sm text-[#9ec4c9]">Last updated: {UPDATED}</p>
        </header>

        <p className="text-[15px] leading-7 text-[#c5e0e4]">
          These terms apply to{' '}
          <strong className="text-white">https://speakflow.art</strong>{' '}
          (“SpeakFlow”), operated by{' '}
          <strong className="text-white">Yuriy Dovzhyk</strong>. By using the
          site you agree to these terms and the{' '}
          <Link href="/privacy" className="text-white underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">1. The service</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            SpeakFlow is a browser tool for live speech transcription and
            translation. On desktop it can use your microphone and shared tab
            audio (meetings, YouTube, movies, and similar). On mobile it
            typically supports microphone input only. Features, limits, and
            availability may change.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">2. Not legal advice / no warranty</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Transcripts and translations are generated automatically and may
            contain errors. SpeakFlow is provided{' '}
            <strong className="text-white">“as is”</strong> without warranties
            of accuracy, uptime, or fitness for a particular purpose. Do not
            rely on it as the sole record for legal, medical, or safety-critical
            decisions.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">3. Acceptable use</h2>
          <ul className="list-disc pl-5 text-[15px] leading-7 text-[#c5e0e4] space-y-2">
            <li>Use SpeakFlow only with audio you have a right to capture.</li>
            <li>
              Do not use it to secretly record people where that is illegal, or
              to violate meeting/platform rules.
            </li>
            <li>
              Do not abuse free quotas, attempt to break the service, or overload
              infrastructure.
            </li>
            <li>
              Do not upload or stream content you are not allowed to process with
              third-party cloud APIs.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">4. Accounts &amp; limits</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Guests and registered users may have different monthly recording
            limits. You are responsible for keeping login credentials secure.
            Saved records belong to your account workflow; export or copy text
            if you need an offline copy. We may suspend abuse or technical harm.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">5. Third-party services</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Live recognition and translation depend on third-party providers
            (including speech-to-text and large language model APIs). Their
            availability and policies can affect SpeakFlow. Browser permissions
            (microphone, tab share) are controlled by you and your browser.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">6. Intellectual property</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            The SpeakFlow name, site design, and software are provided for use
            of the service. You keep rights to your own audio and to text you
            legitimately create with the tool, subject to provider and platform
            rules.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">7. Name clarity</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            SpeakFlow at <strong className="text-white">speakflow.art</strong>{' '}
            is an independent project and is not affiliated with other products
            that may use a similar “Speakflow” name (teleprompters, desktop
            call apps, etc.).
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">8. Changes</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            We may update these terms. The “Last updated” date at the top will
            change when we do. Continued use after an update means you accept
            the revised terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-white">9. Contact</h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            Questions: use the <strong className="text-white">CONTACT</strong>{' '}
            tab on{' '}
            <Link href="/" className="text-white underline underline-offset-2">
              speakflow.art
            </Link>
            .
          </p>
        </section>

        <p className="text-sm text-[#9ec4c9] pt-2">
          Also see{' '}
          <Link href="/privacy" className="text-[#7fd4de] hover:text-white">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/how-it-works" className="text-[#7fd4de] hover:text-white">
            How it works
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
