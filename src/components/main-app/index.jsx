'use client';

import { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import useAudioRecorder from '@/utils/audio-recorder/useAudioRecorder';
import {
  setActiveBtn,
  setCloseButtonAuth,
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
import { getRecords } from '@/redux/technical/technical-operations';
import { gaEvent } from '@/utils/gtag';
import { toast } from 'react-toastify';
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
import Logo from '@/components/shared/logo/logo';

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
  records: 'Your Records',
};

const PanelContent = ({ active }) => {
  if (active === 'info') return <Info />;
  if (active === 'auth') return <Auth />;
  if (active === 'contact') return <Contact />;
  if (active === 'settings') return <SettingsContent />;
  if (active === 'records') return <Records />;
  return null;
};

const InactivityConfirmModal = ({ secondsLeft, onContinue, onStop }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[330px] rounded-2xl border-2 border-[var(--accent2)] bg-white shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--accent2)] bg-[var(--clear-white)]">
          <Text
            type="tiny"
            as="h3"
            fontWeight="bold"
            className="text-[var(--accent2)]"
            noTranslate
          >
            No translated text detected
          </Text>
        </div>

        <div className="px-5 py-4">
          <Text
            type="small"
            as="p"
            fontWeight="normal"
            lineHeight="snug"
            className="text-[var(--text-accent)]"
            noTranslate
          >
            We haven’t received translated text for 3 minutes. Do you want to
            continue listening?
          </Text>

          <Text
            type="extraSmall"
            as="p"
            fontWeight="normal"
            className="mt-3 text-[var(--text-accent)]"
            noTranslate
          >
            Auto stop in {secondsLeft}s
          </Text>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onStop}
              className="flex-1 h-[38px] rounded-[5px] border border-[var(--accent2)] text-[var(--accent2)] hover:bg-[var(--clear-white)] transition-colors"
            >
              <Text type="small" as="span" noTranslate>
                Stop
              </Text>
            </button>

            <button
              type="button"
              onClick={onContinue}
              className="flex-1 h-[38px] rounded-[5px] border border-[var(--accent2)] bg-[var(--accent2)] text-white hover:bg-[var(--accent2-hover)] transition-colors"
            >
              <Text type="small" as="span" className="text-white" noTranslate>
                Continue
              </Text>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EarButton = memo(function EarButton({
  activeKey,
  tabKey,
  label,
  onToggle,
}) {
  const isActive = activeKey === tabKey;

  const handleClick = () => {
    const nextKey = isActive ? null : tabKey;
    onToggle(nextKey);

    gaEvent('tab_toggle', {
      tab_key: tabKey,
      tab_label: label,
      action: isActive ? 'close' : 'open',
    });
  };

  return (
    <button
      onClick={handleClick}
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

const getUsageLimitMessage = ({
  isRegistered,
  limitMinutes = 20,
  registeredLimitMinutes = 40,
}) => {
  if (isRegistered) {
    return `You have used your ${limitMinutes} minutes of translation time. Your limit will reset 30 days after your last session.`;
  }

  return `You have used your ${limitMinutes} minutes of trial translation time. Please sign up to get more time (up to ${registeredLimitMinutes} minutes).`;
};

const ToolCard = () => {
  const dispatch = useDispatch();
  const [activeChannel, setActiveChannel] = useState('speaker');
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
    if (
      typeOperationRecords === 'SaveRecords' ||
      typeOperationRecords === 'GetRecords'
    ) {
      setPanel('records');
    }
  }, [typeOperationRecords, isLogin, showRecordsTab]);

  useEffect(() => {
    if (!isLogin) return;
    if (!hasSaved) dispatch(getRecords());
  }, [dispatch, isLogin, hasSaved]);

  const {
    initialize,
    sendAudio,
    pause,
    disconnect,
    translationInactivityWarning,
    translationInactivityStop,
    confirmInactivityContinue,
    usageLimitReached,
    clearUsageLimitReached,
    refreshUsageFromServer,
    prepareForNewRecording,
    usage,
  } = useSocketContext();

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
    audioContext,
    sourceNodeMic,
    sourceNodeSpeaker,
    audioGraphEpoch,
  } = useAudioRecorder({
    mode: activeLine, // 'microphone' | 'speaker' | 'auto'
    onActiveChannelChange: setActiveChannel,
    dataCb: (audioData, sampleRate, sourceType) => {
      sendAudio(audioData, sampleRate, sourceType);
    },
  });

  const MODAL_AUTO_STOP_SECONDS = 60;

  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [modalSecondsLeft, setModalSecondsLeft] = useState(
    MODAL_AUTO_STOP_SECONDS
  );

  const stopListeningSession = () => {
    stopRecording();
    disconnect();
    dispatch(setActiveBtn('stop'));
    setShowInactivityModal(false);
    setModalSecondsLeft(MODAL_AUTO_STOP_SECONDS);
  };

  const uiIconMode = isRecording ? activeChannel : activeLine;

  useEffect(() => {
    if (!translationInactivityWarning) {
      setShowInactivityModal(false);
      setModalSecondsLeft(MODAL_AUTO_STOP_SECONDS);
    }
  }, [translationInactivityWarning, MODAL_AUTO_STOP_SECONDS]);

  useEffect(() => {
    if (!isRecording || isPaused) {
      setShowInactivityModal(false);
      setModalSecondsLeft(MODAL_AUTO_STOP_SECONDS);
      return;
    }

    if (!translationInactivityWarning?.receivedAt) return;

    const autoStopMs = Number(translationInactivityWarning.autoStopMs || 60000);
    setModalSecondsLeft(Math.max(1, Math.ceil(autoStopMs / 1000)));
    setShowInactivityModal(true);
  }, [translationInactivityWarning?.receivedAt, isRecording, isPaused, translationInactivityWarning?.autoStopMs]);

  useEffect(() => {
    if (!showInactivityModal) return;

    const intervalId = window.setInterval(() => {
      setModalSecondsLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [showInactivityModal]);

  useEffect(() => {
    if (!translationInactivityStop?.receivedAt) return;
    stopListeningSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationInactivityStop?.receivedAt]);

  const handleContinueListening = () => {
    confirmInactivityContinue();
    setShowInactivityModal(false);
    setModalSecondsLeft(MODAL_AUTO_STOP_SECONDS);
  };

  const handleStopListening = () => {
    stopListeningSession();
  };

  const monthlyLimitMinutes = Math.max(
    1,
    Math.round(
      (usageLimitReached?.limitMs ||
        usage.monthlyLimitMs ||
        20 * 60 * 1000) / 60000
    )
  );
  const registeredLimitMinutes = Math.max(
    1,
    Math.round(
      (usageLimitReached?.registeredMonthlyLimitMs ||
        usage.registeredMonthlyLimitMs ||
        40 * 60 * 1000) / 60000
    )
  );
  const monthlyLimitMessage = getUsageLimitMessage({
    isRegistered: Boolean(
      usageLimitReached?.isRegistered ?? usage.isRegistered ?? isLogin
    ),
    limitMinutes: monthlyLimitMinutes,
    registeredLimitMinutes,
  });

  useEffect(() => {
    if (!usageLimitReached?.receivedAt) return;

    stopListeningSession();
    toast.error(monthlyLimitMessage);
    clearUsageLimitReached();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageLimitReached?.receivedAt, monthlyLimitMessage]);

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
          const attemptStart = async () => {
            let remaining = usage.monthlyRemainingMs;
            let unlimited = usage.unlimited;

            if (!unlimited && remaining <= 0) {
              const data = await refreshUsageFromServer();
              if (data) {
                remaining = Number(data.monthlyRemainingMs ?? remaining);
                unlimited = Boolean(data.unlimited);
              }
            }

            if (!unlimited && remaining <= 0) {
              toast.error(monthlyLimitMessage);
              dispatch(setActiveBtn('stop'));
              return;
            }

            prepareForNewRecording();
            initialize();
            startRecording();
          };

          attemptStart();
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

  const visualChannel = activeLine === 'auto' ? activeChannel : activeLine;

  return (
    <div className="flex flex-row items-center justify-center pr-[27px] w-full max-w-[390px] overflow-hidden">
      <div className="w-full h-[100vh] landscape:!h-[570px] lg:landscape:!h-[100vh] relative inline-flex items-center justify-center">
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

        <div className="relative h-[85vh] landscape:!h-[85%] w-full rounded-2xl border-2 border-teal-700 bg-white shadow-lg overflow-hidden">
          {showInactivityModal && (
            <InactivityConfirmModal
              secondsLeft={modalSecondsLeft}
              onContinue={handleContinueListening}
              onStop={handleStopListening}
            />
          )}

          <div className="h-[9vh] landscape:!h-[12%] flex justify-between items-center px-4 border-b">
            <div className="flex items-center gap-1">
              <LogoWave />
              <Logo variant="clear" asLink={false} eager />
            </div>
            <div>
              <AuthInfo />
            </div>
          </div>

          <div className="h-[6vh] landscape:!h-[9%] border border-[var(--accent2)] rounded-md mx-4 my-3 flex items-center justify-between">
            <Timer />
            <div className="h-full flex items-center justify-center flex-1">
              {audioContext &&
                visualChannel === 'speaker' &&
                sourceNodeSpeaker && (
                  <AudioBarsVisualizer
                    key={`speaker-${audioGraphEpoch}`}
                    audioContext={audioContext}
                    sourceNode={sourceNodeSpeaker}
                  />
                )}
              {audioContext &&
                visualChannel === 'microphone' &&
                sourceNodeMic && (
                  <AudioBarsVisualizer
                    key={`mic-${audioGraphEpoch}`}
                    audioContext={audioContext}
                    sourceNode={sourceNodeMic}
                  />
                )}
            </div>
            <div className="w-[40px] h-full flex items-center justify-center">
              <img
                src={
                  uiIconMode === 'microphone'
                    ? '/images/buttons/microphone.png'
                    : uiIconMode === 'speaker'
                      ? '/images/buttons/speaker.png'
                      : '/images/buttons/auto.png'
                }
                alt="active channel"
                className="w-5 h-5 mr-2"
                style={{
                  width: uiIconMode === 'speaker' ? '20px' : '25px',
                  height: uiIconMode === 'speaker' ? '20px' : '25px',
                }}
              />
            </div>
          </div>

          <div className="h-[66vh] landscape:!h-[75%] px-4 pb-4 flex flex-col gap-3">
            <div className="flex-1 min-h-0">
              <LiveTextPanels />
            </div>
            <div className="h-[6vh] landscape:!h-[12%] flex flex-row items-center justify-between">
              <PlayModePanel />
              <SaveRecordsPanel />
            </div>
          </div>

          <div
            className={`absolute top-0 right-0 h-full w-full bg-white border-l-2 border-teal-700 shadow-lg transform transition-transform duration-300 ${panel ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          >
            <div className="h-[9vh] landscape:!h-[12%] flex justify-between items-center p-4 border-b">
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
            <div className="flex-1 overflow-y-auto thin-scrollbar p-4 min-h-[74vh] landscape:!min-h-[74%]">
              <PanelContent active={panel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;