'use client';

import { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import useAudioRecorder from '@/utils/audio-recorder/useAudioRecorder';
import {
  setCloseButtonAuth,
  setLine,
  setTypeOperationRecords,
} from '@/redux/technical/technical-slice';
import {
  getCloseButtonAuth,
  getActiveBtn,
  getDeepgramStatus,
  getLine,
  getHasAnyText,
  getTypeOperationRecords,
  getSavedData,
} from '@/redux/technical/technical-selectors';
import {
  getRecords,
} from '@/redux/technical/technical-operations';
import { getLogin } from '@/redux/auth/auth-selectors';
import Auth from '../auth';
import Contact from '../contact';
import SettingsContent from '../settings-content';
import Text from '@/components/shared/text/text';
import LogoWave from '@/components/shared/logo-wave';
import AuthInfo from '../auth-info';
import LiveTextPanels from '../live-text-panels';
import PlayModePanel from '../play-mode-panel';
import AudioBarsVisualizer from '../shared/audio-bars-visualizer';
import Timer from '@/components/shared/timer';
import SaveRecordsPanel from '../save-records-panel';
import Records from '../records';
import Info from '../info';

const TABS = [
  { key: 'info', label: 'INFO' },
  { key: 'auth', label: 'AUTH' },
  { key: 'records', label: 'RECORDS' },
  { key: 'settings', label: 'SETTINGS' },
  { key: 'contact', label: 'CONTACT' },
];

const PanelTitles = {
  settings: 'Settings',
  info: 'Information',
  auth: 'Authentication',
  contact: 'Contact me',
  records: 'Your Records'
};

const PanelContent = ({ active }) => {
  if (active === 'info') return <Info />;
  if (active === 'auth') return <Auth />;
  if (active === 'contact') return <Contact />;
  if (active === 'settings') return <SettingsContent />;
  if (active === 'records') return <Records />;
  return null;
};

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
      className="rotate-90 rounded-t-lg shadow border border-gray-300 pb-[3px]"
      style={{
        backgroundColor: isActive ? 'var(--accent1)' : 'var(--accent2)',
        width: '85px',
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
  const [panel, setPanel] = useState(
    /** @type {null | 'settings' | 'info' | 'auth' | 'contact'} */ null
  );
  const closeButtonAuth = useSelector(getCloseButtonAuth);
  const activeBtn = useSelector(getActiveBtn);
  const activeLine = useSelector(getLine);
  const deepgramStatus = useSelector(getDeepgramStatus);
  const typeOperationRecords = useSelector(getTypeOperationRecords);

  const isLogin = useSelector(getLogin);
  const savedData = useSelector(getSavedData);
  const hasAnyText = useSelector(getHasAnyText);

  const hasSaved = !!(
    savedData &&
    (Array.isArray(savedData)
      ? savedData.length
      : Object.keys(savedData || {}).length)
  );

  const showRecordsTab = isLogin && (hasSaved || hasAnyText);

  const visibleTabs = TABS.filter(t => {
    if (!isLogin && t.key === 'records') return false;
    if (isLogin && t.key === 'auth') return false;
    if (t.key === 'records' && !showRecordsTab) return false;
    return true;
  });

  useEffect(() => {
    if (panel === 'records' && (!isLogin || !showRecordsTab)) {
      setPanel(null);
    }
  }, [panel, isLogin, showRecordsTab]);

  useEffect(() => {
    if (!isLogin) return;
    if (!showRecordsTab) return;
    if (typeOperationRecords === 'SaveRecords' || typeOperationRecords === 'GetRecords') {
      setPanel('records');
    }
  }, [typeOperationRecords, isLogin, showRecordsTab]);

  useEffect(() => {
    if (!isLogin) return;
    if (!hasSaved) dispatch(getRecords());
  }, [dispatch, isLogin, hasSaved]);

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
  }, [activeBtn, isRecording, isPaused, deepgramStatus]);

  return (
    <div className="relative inline-flex items-center justify-center w-fit">
      <div className="absolute top-1/2 -translate-y-1/2 -right-[54px] flex flex-col gap-[55px]">
        {visibleTabs.map(t => (
          <EarButton
            key={t.key}
            activeKey={panel}
            tabKey={t.key}
            label={t.label}
            onToggle={setPanel}
          />
        ))}
      </div>

      <div className="relative h-[85vh] min-w-[317px] w-[310px] rounded-2xl border-2 border-teal-700 bg-white shadow-lg overflow-hidden">
        <div className="h-[9vh] flex justify-between items-center px-4 border-b">
          <div>
            <LogoWave />
          </div>
          <div>
            <AuthInfo />
          </div>
        </div>

        <div className="h-[6vh] border border-[var(--accent2)] rounded-md mx-4 my-3 flex items-center justify-between">
          <Timer />
          <div className="h-full flex items-center justify-center flex-1">
            {audioContext && sourceNodeSpeaker && activeLine === 'speaker' && (
              <AudioBarsVisualizer
                audioContext={audioContext}
                sourceNode={sourceNodeSpeaker}
              />
            )}
            {audioContext && sourceNodeMic && activeLine === 'mic' && (
              <AudioBarsVisualizer
                audioContext={audioContext}
                sourceNode={sourceNodeMic}
              />
            )}
          </div>
          <div className="w-[40px] h-full flex items-center justify-center">
            <img
              src={
                activeLine === 'mic'
                  ? '/images/buttons/microphone.png'
                  : '/images/buttons/speaker.png'
              }
              alt="active channel"
              className="w-5 h-5 mr-2"
              style={{
                width: activeLine === 'mic' ? '25px' : '20px',
                height: activeLine === 'mic' ? '25px' : '20px',
              }}
            />
          </div>
        </div>

        <div className="h-[66vh] px-4 pb-4 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <LiveTextPanels />
          </div>
          <div className="h-[6vh] flex flex-row items-center justify-between">
            <PlayModePanel />
            <SaveRecordsPanel />
          </div>
        </div>

        <div
          className={`absolute top-0 right-0 h-full w-full bg-white border-l-2 border-teal-700 shadow-lg transform transition-transform duration-300 ${panel ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        >
          <div className="h-[9vh] flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-[var(--accent2)]">
              {panel ? PanelTitles[panel] : ''}
            </h2>
            <button
              onClick={() => {
                setPanel(null);
                if (typeOperationRecords) {
                  dispatch(setTypeOperationRecords(null));
                }
              }}
              className="text-sm text-[var(--text-accent)] hover:text-[var(--text-main)]"
            >
              ✖
            </button>
          </div>
          <div className="flex-1 overflow-y-auto thin-scrollbar p-4 min-h-[74vh] test-border">
            <PanelContent active={panel} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolCard;
