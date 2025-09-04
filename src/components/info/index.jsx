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
          1. Open the SpeakFlow
        </Text>
        <Text type="small" as="p" fontWeight="light">
          When you launch the app, the SpeakFlow panel appears. It’s designed to
          stay centered on your screen and always adapt to your device’s height
          (around 85–90% of the screen), so you don’t need to scroll around.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          2. Adjust your settings (SETTINGS tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Before recording, visit Settings and choose:
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              App Language — the language for all menus and buttons.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Transcription Language — the language you will speak or play audio
              in.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Translation Language — the language you want the live translation
              in.
            </Text>
          </li>
        </ul>
        <Text type="small" as="p" fontWeight="light">
          These preferences are saved automatically for the next time you open
          SpeakFlow.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          3. Sign in for extended features (AUTH tab)
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
          4. Start recording (MAIN screen)
        </Text>
        <ol className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Press Play/Record (bottom-left button).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Your browser will ask for permission. <br />
              - Select Entire Screen, <br />
              - allow System Audio, <br />- and click Share.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Begin speaking (microphone) or playing audio (speakers).
            </Text>
          </li>
        </ol>
        <Text type="small" as="p" fontWeight="light">
          SpeakFlow automatically detects the active source: the mic/speaker
          icon updates, and the audio bars show live sound energy.
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Pause temporarily stops capturing. Stop ends the session (next time,
          your browser may ask permissions again).
        </Text>
        <Text type="small" as="p" fontWeight="light">
          A session timer above the visualizer shows how long you’ve been
          recording.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          5. Watch your live text appear (MAIN screen)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          The main screen is split into two panels:
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Transcript (top) — your original speech.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Translation (bottom) — automatic live translation.
            </Text>
          </li>
        </ul>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Auto-scroll — text flows to the bottom as it arrives.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Copy — use the round button in the top-right of each panel to copy
              all text.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Clear — clears the panel and removes all text captured in this
              session (use with care).
            </Text>
          </li>
        </ul>
        <Text type="small" as="p" fontWeight="light">
          Clear ≠ Stop: <br />
          - Clear removes the panel content and the session’s collected text,
          but recording continues; <br />- Stop ends the recording session.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          6. Enjoy live audio feedback
        </Text>
        <Text type="small" as="p" fontWeight="light">
          The visualizer shows moving bars like an equalizer. Bars rise with
          louder sounds. Color subtly shifts so you can “see” sound intensity at
          a glance.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          7. Save your session (RECORDS tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Click Save (bottom-right MAIN screen) or open the RECORDS tab → Save
          Records. Add a Title to recognize it later. Transcript and Translation
          are prefilled — edit if you like — then submit to store it in your
          account.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          8. Browse & manage your records (RECORDS tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Open the RECORDS tab → Get Records. You’ll see your saved sessions
          (newest first) with title, date, and a short preview.
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              Open a record to view details.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Delete a record you no longer need.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Search instantly: type any word, phrase, or a date (e.g.,
              2025-09-03, 03.09.2025, 03/09/2025) — results filter as you type.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          9. Small but important details
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text type="small" as="span" fontWeight="light">
              RECORDS tab appears only when you’re signed in.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Disabled buttons show tooltips (e.g., “Please sign in…”).
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Nothing is saved automatically — you decide when to Save.
            </Text>
          </li>
          <li>
            <Text type="small" as="span" fontWeight="light">
              Copy works even while recording. If text gets long, use Clear,
              Save, or both.
            </Text>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          10. Contact me (CONTACT tab)
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Open the CONTACT tab, fill out the form (name, email, message), and
          send your question or feedback. Your request goes directly to me — I’m
          happy to help.
        </Text>
      </section>

      <section className="flex flex-col gap-2">
        <Text type="tiny" as="h3" fontWeight="medium">
          That’s SpeakFlow
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Choose your languages. Hit Record. Watch live Transcript & Translation
          flow. Copy, Clear, Save, or Reopen sessions anytime. Sign in for
          extended time and records.
        </Text>
        <Text type="small" as="p" fontWeight="light">
          Pro Tip: SpeakFlow isn’t just for speech — try it with lectures,
          YouTube videos, or calls. It transcribes & translates in real time.
        </Text>
      </section>
    </div>
  );
};

export default Info;
