import Link from 'next/link';

/**
 * Indexable content below the first viewport.
 * The centered SpeakFlow tool above stays unchanged.
 */
export default function HomeSeoContent() {
  return (
    <section
      className="w-full bg-[#0b3d44] text-[#e8f4f5] border-t border-[#1a6b75]"
      aria-label="About SpeakFlow"
    >
      <div className="mx-auto max-w-3xl px-5 py-14 flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Live transcription &amp; translation for your voice and your
            computer
          </h2>
          <p className="text-[15px] leading-7 text-[#c5e0e4]">
            SpeakFlow turns speech into text and translates it in real time.
            On desktop it listens to your microphone and to audio playing on
            your computer — Google Meet, YouTube, movies, lectures, and more.
            On mobile it uses the microphone as a live travel translator when
            someone speaks to you in another language.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2">
          <article className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-white">
              Desktop: meetings &amp; media
            </h3>
            <p className="text-[14px] leading-6 text-[#c5e0e4]">
              Share a browser tab with audio to capture colleagues in Google
              Meet, Zoom (web), or Teams — or translate what you watch on
              YouTube and in films. Use Auto to switch between your mic and
              tab audio during the same session.
            </p>
          </article>
          <article className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-white">
              Mobile: speak &amp; understand
            </h3>
            <p className="text-[14px] leading-6 text-[#c5e0e4]">
              Phone browsers cannot share system audio, but the microphone still
              shines: ask for directions abroad, follow a local conversation, or
              practice a language with live transcript and translation on
              screen.
            </p>
          </article>
        </div>

        <article className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-white">
            Built for real international work
          </h3>
          <p className="text-[14px] leading-6 text-[#c5e0e4]">
            SpeakFlow started from the need to keep up in an international team
            — when meetings and content move fast in another language. The tool
            in the center of this page is the product: hit Record, read the
            transcript, follow the translation, save the session when you need
            it.
          </p>
        </article>

        <ul className="grid gap-2 text-[14px] leading-6 text-[#c5e0e4] list-disc pl-5">
          <li>Live speech-to-text with linked sentence highlighting</li>
          <li>Instant AI translation with style and short context</li>
          <li>Microphone + tab audio on desktop; microphone on mobile</li>
          <li>Save and reopen sessions when signed in</li>
        </ul>

        <p className="text-[14px] leading-6 text-[#c5e0e4]">
          New here? Read the{' '}
          <Link
            href="/how-it-works"
            className="text-white underline underline-offset-2 hover:text-[#7fd4de]"
          >
            how SpeakFlow works
          </Link>{' '}
          guide — then scroll back up and start the tool.
        </p>
      </div>
    </section>
  );
}
