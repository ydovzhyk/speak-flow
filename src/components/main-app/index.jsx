'use client';

import { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import useAudioRecorder from '@/utils/audio-recorder/useAudioRecorder';
import {
  setCloseButtonAuth,
  setLine,
  setActiveBtn,
  setCountdown,
} from '@/redux/technical/technical-slice';
import { getCloseButtonAuth, getCountdown, getActiveBtn, getDeepgramStatus, getLine } from '@/redux/technical/technical-selectors';
import Auth from '../auth';
import Contact from '../contact';
import SettingsContent from '../settings-content';
import Text from '@/components/shared/text/text';
import LogoWave from '@/components/shared/logo-wave';
import AuthInfo from '../auth-info';
import Countdown from '@/components/shared/countdown';
import LiveTextPanels from '../live-text-panels';
import PlayModePanel from '../play-mode-panel';
import { SocketProvider } from '@/utils/socket-provider/socket-provider';

const TABS = [
  { key: 'settings', label: 'Settings' },
  { key: 'info', label: 'Information' },
  { key: 'auth', label: 'Authentication' },
  { key: 'contact', label: 'Contact' },
];

const PanelTitles = {
  settings: 'Settings',
  info: 'Information',
  auth: 'Authentication',
  contact: 'Contact me',
};

const PanelContent = ({ active }) => {
  if (active === 'info') {
    return (
      <div>
        <p className="mb-2">ℹ️ Some info about SpeakFlow…</p>
        <ul className="list-disc pl-5 text-sm">
          <li>How it works</li>
          <li>Tips</li>
          <li>Privacy</li>
        </ul>
      </div>
    );
  }
  if (active === 'auth') return <Auth />;
  if (active === 'contact') return <Contact />;
  if (active === 'settings') return <SettingsContent />;
  return null;
};

// маленький підкомпонент “вушка”
const EarButton = memo(function EarButton({
  activeKey,
  tabKey,
  label,
  onToggle,
}) {
  const isActive = activeKey === tabKey;
  return (
    <button
      onClick={() => onToggle(isActive ? null : tabKey)}
      className="rotate-90 rounded-t-lg shadow w-[100px] border border-gray-300 pb-[3px]"
      style={{
        backgroundColor: isActive ? 'var(--accent1)' : 'var(--accent2)',
      }}
      aria-pressed={isActive}
    >
      <Text
        type="extraSmall"
        as="span"
        fontWeight="light"
        className="text-[var(--clear-white)]"
      >
        {label}
      </Text>
    </button>
  );
});

const ToolCard = () => {
  const dispatch = useDispatch();
  const countdown = useSelector(getCountdown);
  const [panel, setPanel] = useState(
    /** @type {null | 'settings' | 'info' | 'auth' | 'contact'} */ null
  );
  const closeButtonAuth = useSelector(getCloseButtonAuth);
  const activeBtn = useSelector(getActiveBtn);
  const activeLine = useSelector(getLine);
  const deepgramStatus = useSelector(getDeepgramStatus);

  const { initialize, sendAudio, pause, disconnect } = useSocketContext();
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
    audioContext,
    sourceNodeMic,
    sourceNodeSpeaker,
  } = useAudioRecorder({
    dataCb: (audioData, sampleRate, sourceType) => {
      sendAudio(audioData, sampleRate, sourceType);
      dispatch(setLine(sourceType));
    },
  });

  // ESC → закриття
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && setPanel(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // автозакриття після успішного логіну
  useEffect(() => {
    if (closeButtonAuth && panel === 'auth') {
      setPanel(null);
      dispatch(setCloseButtonAuth(false));
    }
  }, [closeButtonAuth, panel, dispatch]);

  useEffect(() => {
    switch (activeBtn) {
      case 'record':
        if (!isRecording && !isPaused) {
          initialize();
          startRecording();
        } else if (isRecording && isPaused) {
          togglePauseResume();
          pause(false);
        }
        break;

      case 'pause':
        if (isRecording && !isPaused) {
          togglePauseResume();
          pause(true);
        }
        break;

      case 'stop':
        if (deepgramStatus) {
          stopRecording();
          disconnect();
        }
        break;

      default:
        break;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeBtn, isRecording, isPaused /* deepgramStatus? */]);

  return (
    <div className="relative inline-flex items-center justify-center w-fit">
      {/* Вушка праворуч */}
      <div className="absolute top-[100px] -right-[62px] flex flex-col gap-[70px]">
        {TABS.map(t => (
          <EarButton
            key={t.key}
            activeKey={panel}
            tabKey={t.key}
            label={t.label}
            onToggle={setPanel}
          />
        ))}
      </div>

      {/* Карта тула */}
      <div className="relative h-[560px] w-[380px] rounded-2xl border-2 border-teal-700 bg-white shadow-lg overflow-hidden">
        {/* <div className="p-4 h-[500px]">Main SpeakFlow Tool content here…</div> */}
        <div className="h-[57px] flex justify-between items-center px-4 border-b">
          <div>
            <LogoWave />
          </div>
          <div>
            <AuthInfo />
          </div>
        </div>

            <div className="p-4">
              <LiveTextPanels />
            </div>

        <div className="p-4">
          <PlayModePanel />
        </div>

        {/* Сайд-панель */}
        <div
          className={`absolute top-0 right-0 h-full w-full bg-white border-l-2 border-teal-700 shadow-lg transform transition-transform duration-300 ${panel ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-[var(--accent2)]">
              {panel ? PanelTitles[panel] : ''}
            </h2>
            <button
              onClick={() => setPanel(null)}
              className="text-sm text-[var(--text-accent)] hover:text-[var(--text-main)]"
            >
              ✖
            </button>
          </div>
          <div className="p-4">
            <PanelContent active={panel} />
          </div>
        </div>
      </div>
      {/* {countdown && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/0 z-50">
          <Countdown
            onFinish={() => {
              dispatch(setCountdown(false));
            }}
          />
        </div>
      )} */}
    </div>
  );
}

export default ToolCard;
