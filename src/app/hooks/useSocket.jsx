import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import {
  setDeepgramStatus,
  pushTranscript,
  pushTranslation,
} from '@/redux/technical/technical-slice';
import {
  getInputLanguage,
  getOutputLanguage,
} from '@/redux/technical/technical-selectors';
import { getUser } from '@/redux/auth/auth-selectors';
import { useStreamingParagraph } from '@/utils/useStreamingParagraph';
import { codeToLabel } from '../../data/languages';
import { axiosEnsureGuest } from '@/api/guest';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'speakflow.settings';
const AUTH_STORAGE_KEY = 'speakflow.authData';
const serverURL = 'https://speak-flow-server-fe4ec363ae5c.herokuapp.com';
// const serverURL = 'http://localhost:4000';

function readSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSettings(patch) {
  try {
    const prev = readSettings();
    const next = { ...prev, ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function readAuthData() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function mapUsageState(payload, prev = {}) {
  const last = payload?.lastSession || {};
  return {
    totalMs: Number(payload?.totalMs ?? prev.totalMs ?? 0),
    monthlyRecordMs: Number(
      payload?.monthlyRecordMs ?? prev.monthlyRecordMs ?? 0
    ),
    monthlyRemainingMs: Number(
      payload?.monthlyRemainingMs ?? prev.monthlyRemainingMs ?? 5 * 60 * 1000
    ),
    monthlyLimitMs: Number(
      payload?.monthlyLimitMs ?? prev.monthlyLimitMs ?? 5 * 60 * 1000
    ),
    usagePeriodMs: Number(
      payload?.usagePeriodMs ?? prev.usagePeriodMs ?? 30 * 24 * 60 * 60 * 1000
    ),
    monthlyResetAt: payload?.monthlyResetAt ?? prev.monthlyResetAt ?? null,
    isRegistered: Boolean(payload?.isRegistered ?? prev.isRegistered),
    unlimited: Boolean(payload?.unlimited ?? prev.unlimited),
    lastSession: {
      seconds: Number(
        last.seconds ?? prev.lastSession?.seconds ?? 0
      ),
      startedAt: last.startedAt ?? prev.lastSession?.startedAt ?? null,
      endedAt: last.endedAt ?? prev.lastSession?.endedAt ?? null,
    },
  };
}

function formatSocketError(payload) {
  if (!payload) return 'Connection error. Please try again.';
  if (typeof payload === 'string') return payload;

  const message = String(payload.message || '').trim();
  const detail = String(payload.detail || payload.description || '').trim();
  const code = String(payload.code || '').trim();

  if (code === 'NO_IDENTITY' || message === 'Guest session required') {
    return 'Session expired. Please refresh the page.';
  }

  if (message === 'translate failed' || code === 'TRANSLATION_UNAVAILABLE') {
    if (
      /api key|401|incorrect api key|invalid_api_key|authentication/i.test(
        detail
      )
    ) {
      return 'Translation is temporarily unavailable. Please try again later.';
    }
    return detail || 'Translation failed. Please try again.';
  }

  if (message === 'orchestrator failed') {
    return detail || 'Something went wrong during translation.';
  }

  if (message === 'usage update failed') {
    return 'Could not save session usage.';
  }

  return detail || message || 'Something went wrong. Please try again.';
}

function createSocketErrorNotifier() {
  let lastText = '';
  let timer = null;

  return payload => {
    const text = formatSocketError(payload);
    if (!text || text === lastText) return;

    lastText = text;
    toast.error(text);

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      lastText = '';
      timer = null;
    }, 5000);
  };
}

const useSocket = () => {
  const socketRef = useRef(null);
  const readyResolverRef = useRef(null);
  const dispatch = useDispatch();
  const outputLanguage = codeToLabel(useSelector(getOutputLanguage));
  const inputLanguage = useSelector(getInputLanguage);
  const user = useSelector(getUser);
  const handshakeIdRef = useRef(null);
  const notifySocketErrorRef = useRef(createSocketErrorNotifier());
  const recordingBlockedRef = useRef(false);
  const [translationInactivityWarning, setTranslationInactivityWarning] =
    useState(null);
  const [translationInactivityStop, setTranslationInactivityStop] =
    useState(null);
  const [usageLimitReached, setUsageLimitReached] = useState(null);

  const [usage, setUsage] = useState(() =>
    mapUsageState({
      totalMs: user?.usage?.totalRecordMs || 0,
      monthlyRecordMs: user?.usage?.monthlyRecordMs || 0,
      lastSession: {
        seconds: Math.floor((user?.usage?.lastSession?.durationMs || 0) / 1000),
        startedAt: user?.usage?.lastSession?.startedAt || null,
        endedAt: user?.usage?.lastSession?.endedAt || null,
      },
    })
  );

  const pad = n => String(n).padStart(2, '0');
  const formatSeconds = (sec = 0) => {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(ss)}`;
  };
  const formatMs = (ms = 0) => formatSeconds(Math.floor(ms / 1000));

  useEffect(() => {
    const u = user?.usage;
    if (!u) return;
    setUsage(prev =>
      mapUsageState(
        {
          totalMs: u.totalRecordMs || 0,
          monthlyRecordMs: u.monthlyRecordMs || 0,
          lastSession: {
            seconds: Math.floor((u.lastSession?.durationMs || 0) / 1000),
            startedAt: u.lastSession?.startedAt || null,
            endedAt: u.lastSession?.endedAt || null,
          },
        },
        prev
      )
    );
  }, [user]);

  useEffect(() => {
    const desiredId = user?._id || readSettings().clientId;
    const currentId = handshakeIdRef.current;

    if (
      socketRef.current &&
      desiredId &&
      currentId &&
      desiredId !== currentId
    ) {
      try {
        socketRef.current.emit('disconnect-deepgram');
      } catch (e) {
        console.warn('disconnect-deepgram emit failed:', e);
      }
      socketRef.current.disconnect();
      socketRef.current = null;

      initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const {
    displayedText: transcriptText,
    enqueueSentence: enqueueTranscript,
    reset: resetTranscript,
  } = useStreamingParagraph(22);

  const {
    displayedText: translationText,
    enqueueSentence: enqueueTranslation,
    reset: resetTranslation,
  } = useStreamingParagraph(22);

  const resolveClientId = async () => {
    if (user?._id) {
      writeSettings({ clientId: user._id });
      return user._id;
    }

    const { clientKey } = await axiosEnsureGuest();
    writeSettings({ clientId: clientKey });
    return clientKey;
  };

  const attachSocketListeners = (s, clientId) => {
    s.on('connect', () => {
      console.log('🟢 WebSocket connected as', clientId);
      handshakeIdRef.current = clientId;
    });

    s.on('disconnect', () => {
      console.log('🔴 WS disconnected');
      dispatch(setDeepgramStatus(false));
    });

    s.on('transcriber-ready', data => {
      if (data === 'Ready') {
        dispatch(setDeepgramStatus(true));
        if (readyResolverRef.current) {
          readyResolverRef.current(s);
          readyResolverRef.current = null;
        }
      }
    });

    s.on('close', msg => {
      if (msg === 'Deepgram connection is closed') {
        dispatch(setDeepgramStatus(false));
      }
    });

    s.on('final', transcript => {
      console.log('🟢 Final transcript received:', transcript);
      enqueueTranscript(transcript);
      dispatch(pushTranscript(transcript));
    });

    s.on('final-transleted', translation => {
      console.log('🟢 Final translation received:', translation);

      const cleanTranslation = String(translation || '').trim();
      if (!cleanTranslation) return;

      enqueueTranslation(cleanTranslation);
      dispatch(pushTranslation(cleanTranslation));
    });

    s.on('translation-inactivity-warning', payload => {
      console.warn('⚠️ Translation inactivity warning:', payload);

      setTranslationInactivityWarning({
        ...payload,
        receivedAt: Date.now(),
      });
    });

    s.on('translation-inactivity-stop', payload => {
      console.warn('⚠️ Translation inactivity auto-stop:', payload);
      dispatch(setDeepgramStatus(false));
      setTranslationInactivityStop({
        ...payload,
        receivedAt: Date.now(),
      });
    });

    s.on('translation-inactivity-cancelled', () => {
      setTranslationInactivityWarning(null);
      setTranslationInactivityStop(null);
    });

    s.on('usage-limit-reached', payload => {
      console.warn('⚠️ Monthly usage limit reached:', payload);
      recordingBlockedRef.current = true;
      dispatch(setDeepgramStatus(false));
      setUsage(prev =>
        mapUsageState(
          {
            ...payload,
            monthlyRemainingMs: 0,
            monthlyRecordMs:
              payload.monthlyRecordMs ?? prev.monthlyLimitMs ?? 0,
          },
          prev
        )
      );
      setUsageLimitReached({
        ...payload,
        receivedAt: Date.now(),
      });
    });

    s.on('usage:current', payload => {
      setUsage(prev => {
        const next = mapUsageState(payload, prev);
        if (next.unlimited || next.monthlyRemainingMs > 0) {
          recordingBlockedRef.current = false;
        }
        return next;
      });
    });

    s.on('usage:progress', payload => {
      const startedAt = payload?.startedAt || null;
      const seconds = Number(payload?.seconds || 0);
      const liveTotalMs = Number(payload?.liveTotalMs ?? NaN);

      setUsage(prev => ({
        ...mapUsageState(payload, prev),
        totalMs: Number.isFinite(liveTotalMs) ? liveTotalMs : prev.totalMs,
        lastSession: { startedAt, endedAt: null, seconds },
      }));
    });

    s.on('usage:final', payload => {
      setUsage(prev => {
        const next = mapUsageState(payload, prev);
        if (next.unlimited || next.monthlyRemainingMs > 0) {
          recordingBlockedRef.current = false;
        } else if (next.monthlyRemainingMs <= 0) {
          recordingBlockedRef.current = true;
        }
        return next;
      });
    });

    s.on('error', payload => {
      console.warn('socket error:', payload);
      notifySocketErrorRef.current(payload);
    });

    s.on('connect_error', err => {
      console.warn('socket connect_error:', err?.message || err);
      notifySocketErrorRef.current({
        message: 'connect_error',
        detail: err?.message,
      });
    });
  };

  const initialize = async () => {
    if (socketRef.current) {
      return socketRef.current;
    }

    const clientId = await resolveClientId();
    const authData = readAuthData();

    const readyPromise = new Promise(resolve => {
      readyResolverRef.current = resolve;
    });

    const s = io(serverURL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        clientId,
        ...(authData?.accessToken
          ? { accessToken: authData.accessToken }
          : {}),
      },
    });

    socketRef.current = s;
    attachSocketListeners(s, clientId);

    return readyPromise;
  };

  const sendAudio = async (audioData, sampleRate, sourceType) => {
    if (recordingBlockedRef.current) return;

    if (!socketRef.current) {
      await initialize();
    }

    const s = socketRef.current;
    if (!s || recordingBlockedRef.current) return;

    const clientId = user?._id || readSettings().clientId;
    s.emit('incoming-audio', {
      audioData,
      sampleRate,
      sourceType,
      targetLanguage: outputLanguage,
      inputLanguage,
      clientId,
    });
  };

  const pause = data => {
    socketRef.current?.emit('pause-deepgram', data);
  };

  const confirmInactivityContinue = () => {
    socketRef.current?.emit('inactivity-continue');
    setTranslationInactivityWarning(null);
    setTranslationInactivityStop(null);
  };

  const disconnect = () => {
    const s = socketRef.current;
    if (!s) return;
    s.emit('disconnect-deepgram');
    s.disconnect();
    socketRef.current = null;
    handshakeIdRef.current = null;
    recordingBlockedRef.current = false;

    setTranslationInactivityWarning(null);
    setTranslationInactivityStop(null);
  };

  const clearUsageLimitReached = () => setUsageLimitReached(null);

  const isConnected = () => Boolean(socketRef.current?.connected);

  return {
    initialize,
    sendAudio,
    pause,
    disconnect,
    transcriptText,
    translationText,
    resetTranscript,
    resetTranslation,

    isConnected,

    usage,
    usageFormatted: {
      total: formatMs(usage.totalMs),
      lastSession: formatSeconds(usage.lastSession?.seconds || 0),
      monthlyRemaining: formatMs(usage.monthlyRemainingMs),
    },

    translationInactivityWarning,
    translationInactivityStop,
    confirmInactivityContinue,
    usageLimitReached,
    clearUsageLimitReached,
  };
};

export default useSocket;
