'use client';

import Text from '@/components/shared/text/text';

const Info = () => {
  return (
    <div className="flex flex-col gap-4 border border-[rgba(82,85,95,0.2)] p-4 rounded-md">
      <Text type="regular" as="h2" fontWeight="bold">
        SpeakFlow — User Guide
      </Text>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          1. Open SpeakFlow
        </Text>
        <Text type="small" as="p" fontWeight="light">
          When you open the website, you’ll see the main tool right away.
          SpeakFlow works in any modern browser: on desktop you can capture both
          your microphone and meeting/tab audio; on mobile you can record only
          from the microphone.
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
              Transcription Language — the language you will speak or hear in
              the meeting.
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
              <strong>Microphone</strong> — only your mic (your own voice).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Speaker</strong> — tab/system audio from a shared browser
              tab (colleagues in a meeting, videos). Desktop browsers.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Auto</strong> — switches between microphone and shared
              tab audio during recording.
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
          3. Meetings (Google Meet, Zoom in browser, Teams, etc.)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          To hear and translate your colleagues, SpeakFlow needs the{' '}
          <strong>meeting tab’s audio</strong> — not your whole screen.
        </Text>
        <ol className="list-decimal pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              <strong>Join the meeting first</strong> (Google Meet or another
              browser-based call) and keep that tab open.
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
              <strong>Auto</strong>.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Press <strong>Record</strong>. In the browser share dialog choose{' '}
              <strong>Chrome Tab</strong> (or “A tab”) — select the{' '}
              <strong>exact meeting tab</strong>, enable{' '}
              <strong>Share tab audio</strong>, then click Share.
            </Text>
          </li>
        </ol>
        <Text type="small" as="p" fontWeight="light">
          Important:
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Do <strong>not</strong> share Entire Screen for meetings — tab
              audio is more reliable and captures only the call.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Start the meeting <strong>before</strong> sharing. If you share
              first and then open Meet, you may need to share the Meet tab
              again.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Your mic still captures only you; shared tab audio captures what
              you hear from the meeting.
            </Text>
          </li>
        </ul>
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
          Join the meeting → share that tab’s audio → hit Record → follow live
          transcript and translation. Copy, expand, save, and reopen anytime.
        </Text>
      </section>
    </div>
  );
};

export default Info;
