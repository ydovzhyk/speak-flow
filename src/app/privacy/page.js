import Link from 'next/link';
import SitePageShell from '@/components/seo/site-page-shell';

const SITE_URL = 'https://speakflow.art';
const UPDATED = 'November 27, 2026';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for SpeakFlow.art — how audio, transcripts, accounts, and analytics are handled.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: 'SpeakFlow Privacy Policy',
    description:
      'How SpeakFlow processes microphone/tab audio, transcripts, translations, and account data.',
    url: `${SITE_URL}/privacy`,
    siteName: 'SpeakFlow',
    type: 'article',
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <SitePageShell>
      <header className="flex flex-col gap-2 -mt-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--accent2)]">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600">Last updated: {UPDATED}</p>
      </header>

      <p className="text-[15px] leading-7">
        SpeakFlow (<strong>speakflow.art</strong>) is an independent browser
        tool by <strong>Yuriy Dovzhyk</strong>. This policy explains what data
        we process when you use live transcription and translation. The product
        previously used the domain <strong>speakflow.space</strong>; that
        domain is no longer operated by us. The only official site is
        speakflow.art.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">
          1. What SpeakFlow does
        </h2>
        <p className="text-[15px] leading-7">
          SpeakFlow captures audio from your microphone and, on desktop, from a
          browser tab you choose to share (for example Google Meet, YouTube, or
          a movie tab). It turns speech into text and translates that text in
          near real time. Processing is <strong>not fully on-device</strong>:
          audio and text are sent to cloud services through our backend. The
          product is under active development; monthly recording time is
          currently limited (about 20 minutes for guests, 40 minutes when signed
          in).
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">
          2. Data we process
        </h2>
        <ul className="list-disc pl-5 text-[15px] leading-7 space-y-2">
          <li>
            <strong>Audio streams</strong> during an active recording session
            (microphone and/or shared tab audio).
          </li>
          <li>
            <strong>Transcripts and translations</strong> generated from that
            audio.
          </li>
          <li>
            <strong>Guest usage data</strong> such as approximate IP-based
            limits and a browser cookie/client key so free quotas work without
            an account.
          </li>
          <li>
            <strong>Account data</strong> if you sign up or use Google sign-in:
            email, profile basics you provide, and saved records you choose to
            store.
          </li>
          <li>
            <strong>Contact messages</strong> you send via the CONTACT form
            (name, email, message).
          </li>
          <li>
            <strong>Analytics</strong> (for example Google Analytics / Vercel
            Analytics) about page views and basic product usage — not the
            content of your private transcripts unless you save them to your
            account.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">
          3. Where audio and text go
        </h2>
        <p className="text-[15px] leading-7">
          During a live session, audio is streamed to the SpeakFlow server, then
          to <strong>Deepgram</strong> for speech-to-text. Transcript sentences
          are sent to <strong>OpenAI</strong> for translation (and occasional
          style hints). These providers process data under their own terms and
          privacy policies. Do not use SpeakFlow for highly sensitive medical,
          legal, or confidential negotiations unless you accept that cloud
          processing is involved.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">
          4. What we store
        </h2>
        <ul className="list-disc pl-5 text-[15px] leading-7 space-y-2">
          <li>
            Live audio is processed for the session; we do not market SpeakFlow
            as a long-term raw-audio archive.
          </li>
          <li>
            If you are signed in and use <strong>Save</strong>,
            transcript/translation text (and paired segments) are stored in our
            database so you can reopen them.
          </li>
          <li>
            Usage meters (for free limits) and account records are stored to
            operate the service.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">
          5. Cookies &amp; local data
        </h2>
        <p className="text-[15px] leading-7">
          We use cookies or local storage for guest identity, auth session,
          language/settings preferences, and analytics. You can clear site data
          in your browser; signed-in saved records remain on the server until
          you delete them or delete your account.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">
          6. Your choices
        </h2>
        <ul className="list-disc pl-5 text-[15px] leading-7 space-y-2">
          <li>Use SpeakFlow as a guest within free limits, or sign in.</li>
          <li>
            Stop sharing tab audio or the microphone at any time in the browser.
          </li>
          <li>Delete individual saved records when signed in.</li>
          <li>
            Request account/data help via the in-app <strong>CONTACT</strong>{' '}
            tab.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">7. Children</h2>
        <p className="text-[15px] leading-7">
          SpeakFlow is not directed at children under 16. Do not use the service
          to capture a child’s voice without appropriate consent.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-[var(--accent2)]">8. Contact</h2>
        <p className="text-[15px] leading-7">
          Operator: <strong>Yuriy Dovzhyk</strong>. For privacy questions use
          the CONTACT form on{' '}
          <Link
            href="/"
            className="text-[var(--accent2)] underline underline-offset-2"
          >
            speakflow.art
          </Link>
          .
        </p>
      </section>

      <p className="text-sm text-gray-600">
        Also see{' '}
        <Link
          href="/terms"
          className="text-[var(--accent2)] underline underline-offset-2"
        >
          Terms of Use
        </Link>{' '}
        and{' '}
        <Link
          href="/how-it-works"
          className="text-[var(--accent2)] underline underline-offset-2"
        >
          How it works
        </Link>
        .
      </p>
    </SitePageShell>
  );
}
