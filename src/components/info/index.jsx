'use client';

import Text from '@/components/shared/text/text';

const Info = () => {
  return (
    <div className="flex flex-col gap-4 border border-[rgba(82,85,95,0.2)] p-4 rounded-md">
      <Text type="regular" as="h2" fontWeight="bold">
        SpeakFlow — User Guide
      </Text>

      <section className="flex flex-col gap-2 rounded-md border border-[var(--accent2)] border-opacity-40 bg-[var(--clear-white)] p-3">
        <Text type="tiny" as="h3" fontWeight="medium">
          Live transcription &amp; translation for your voice and your computer
        </Text>
        <Text type="small" as="p" fontWeight="light">
          On desktop: your microphone and audio playing on the computer —
          Google Meet, YouTube, movies, lectures. On mobile: microphone only —
          a live travel translator when someone speaks near you. The tool stays
          in the center of the page; this INFO tab is the in-app guide.
        </Text>
        <a
          href="/how-it-works"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[var(--accent2)] underline underline-offset-2 hover:text-[var(--text-main)] w-fit"
        >
          Open full “How it works” page →
        </a>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          1. Open SpeakFlow
        </Text>
        <Text type="small" as="p" fontWeight="light">
          When you open the website, you’ll see the main tool right away —
          centered on the page. On desktop SpeakFlow can capture your
          microphone and audio playing on your computer (meetings, YouTube,
          movies). On mobile it uses the microphone as a live travel translator.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          2. Adjust your settings (SETTINGS tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Before recording, open the SETTINGS tab and choose:
        </Text>

        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              App Language — the language for all menus and buttons.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Transcription Language — the language you speak or hear (meeting,
              video, or people around you).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Translation Language — the language you want the live translation
              in.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Audio Recording Source — Microphone / Speaker / Auto.
            </Text>
          </li>
        </ul>

        <Text type="small" as="p" fontWeight="light">
          Audio Recording Source modes:
        </Text>

        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Microphone</strong> — your voice on desktop or mobile
              (speaking in a call, dictation, or travel conversations).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Speaker</strong> — audio from a shared browser tab:
              colleagues in a meeting, YouTube, films, lectures. Desktop
              browsers.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Auto</strong> — switches between your microphone and
              shared tab audio in one session (desktop).
            </Text>
          </li>
        </ul>

        <Text type="small" as="p" fontWeight="light">
          If you are signed in, you can also customize your profile and see your
          recording statistics. Preferences are saved automatically.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          3. Computer audio: meetings, YouTube, movies (desktop)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          To translate what your computer plays — colleagues in a call, a
          YouTube video, a film — SpeakFlow needs that{' '}
          <strong>tab’s audio</strong>, not the entire screen.
        </Text>
        <ol className="list-decimal pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Start the source first</strong>: join Google Meet / Zoom
              web / Teams, or open the YouTube/movie tab, and keep it open.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Open SpeakFlow in a <strong>separate tab</strong> (or window).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              In SETTINGS, set source to <strong>Speaker</strong> or{' '}
              <strong>Auto</strong> (Auto still uses your microphone too).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Press <strong>Record</strong>. Choose <strong>Chrome Tab</strong>,
              select the <strong>exact tab</strong> that is playing audio,
              enable <strong>Share tab audio</strong>, then Share.
            </Text>
          </li>
        </ol>
        <Text type="small" as="p" fontWeight="light">
          Important:
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Prefer <strong>Chrome Tab</strong> over Entire Screen for
              reliable audio from meetings and videos.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Start Meet/video <strong>before</strong> sharing. If you open it
              after sharing, share that tab again.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Desktop microphone always works: your voice in the call, plus tab
              audio for what you hear.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          3b. Mobile &amp; travel (microphone)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          On phones, browsers cannot share system audio — only the microphone.
          That is still powerful: in another country, open SpeakFlow, allow the
          mic, and get a live transcript and translation when someone explains
          directions or speaks near you.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          4. Sign in for extended features (AUTH tab)
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Extended recording time (guests have shorter sessions).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Ability to save sessions to your account.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Quick login via Google — just one click.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          5. Start recording (MAIN screen)
        </Text>

        <ol className="list-decimal pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Press <strong>Play/Record</strong> (bottom-left button).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              If Speaker/Auto is selected, your browser asks what to share:
              <br />– prefer <strong>Chrome Tab</strong> + the meeting (or
              media) tab,
              <br />– turn on <strong>Share tab audio</strong>,
              <br />– click <strong>Share</strong>.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Speak into the mic and/or let meeting audio play — SpeakFlow
              transcribes and translates live.
            </Text>
          </li>
        </ol>

        <Text type="small" as="p" fontWeight="light">
          The mic/speaker icon and audio bars show which source is active.
        </Text>

        <Text type="small" as="p" fontWeight="medium">
          Pause vs Stop
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Pause</strong> temporarily suspends recording but does not
              end the session. Resume with Record — new text is appended. A long
              pause may drop the browser connection.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Stop</strong> ends the session. Transcript and Translation
              stay on screen so you can copy or save them.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          6. Watch your live text appear (MAIN screen)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          The main screen is split into two panels:
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Transcript (top) — original speech.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Translation (bottom) — live translation.
            </Text>
          </li>
        </ul>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Linked sentences — hover or click a sentence to highlight its pair
              and scroll the other panel to it.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Auto-scroll — while you stay at the bottom, new sentences come into
              view.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Copy / Expand — buttons on each panel to copy text or open it full
              size under the header.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          7. Save &amp; reopen (RECORDS tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          If you are signed in: use <strong>Save</strong> to store the current
          transcript and translation, then open them later under{' '}
          <strong>Saved Records</strong> with the same linked highlight and
          scroll. Search by word, phrase, or date. Delete records you no longer
          need.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          8. Small but important details
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              RECORDS tab appears only when you’re signed in.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Nothing is saved automatically — you decide when to Save.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Copy works even while recording.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          9. Contact me (CONTACT tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Open the CONTACT tab, fill out the form (name, email, message), and
          send your question or feedback.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          That’s SpeakFlow
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Your voice and what your computer plays — live transcript and
          translation. Meetings, YouTube, movies on desktop; mic travel mode on
          mobile. Copy, expand, save, reopen.
        </Text>
      </section>
    </div>
  );
};

export default Info;
