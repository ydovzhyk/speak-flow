import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { v4 as uuid } from 'uuid';
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

const STORAGE_KEY = 'speakflow.settings';
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

const useSocket = () => {
  const socketRef = useRef(null);
  const readyResolverRef = useRef(null);
  const dispatch = useDispatch();
  const outputLanguage = codeToLabel(useSelector(getOutputLanguage));
  const inputLanguage = useSelector(getInputLanguage);
  const user = useSelector(getUser);
  const handshakeIdRef = useRef(null);

  // ===== Usage state =====
  const [usage, setUsage] = useState(() => {
    const u = user?.usage;
    return {
      totalMs: u?.totalRecordMs || 0,
      lastSession: {
        seconds: Math.floor((u?.lastSession?.durationMs || 0) / 1000),
        startedAt: u?.lastSession?.startedAt || null,
        endedAt: u?.lastSession?.endedAt || null,
      },
    };
  });

  // Utility: formatting time
  const pad = n => String(n).padStart(2, '0');
  const formatSeconds = (sec = 0) => {
    const s = Math.max(0, Math.floor(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(ss)}`;
  };
  const formatMs = (ms = 0) => formatSeconds(Math.floor(ms / 1000));

  // User loaded/changed — update initial usage
  useEffect(() => {
    const u = user?.usage;
    if (!u) return;
    setUsage({
      totalMs: u.totalRecordMs || 0,
      lastSession: {
        seconds: Math.floor((u.lastSession?.durationMs || 0) / 1000),
        startedAt: u.lastSession?.startedAt || null,
        endedAt: u.lastSession?.endedAt || null,
      },
    });
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

  const getOrCreateClientId = () => {
    if (user?._id) {
      const prev = readSettings();
      if (prev.clientId !== user._id) writeSettings({ clientId: user._id });
      return user._id;
    }

    let { clientId } = readSettings();
    if (!clientId) {
      clientId = uuid();
      writeSettings({ clientId });
    }
    return clientId;
  };

  const initialize = () => {
    if (socketRef.current) {
      return Promise.resolve(socketRef.current);
    }

    const clientId = getOrCreateClientId();

    socketRef.current = io(serverURL, {
      transports: ['websocket'],
      auth: { clientId },
    });

    const s = socketRef.current;

    const readyPromise = new Promise(resolve => {
      readyResolverRef.current = resolve;
    });

    // ===== WS connection =====
    s.on('connect', () => {
      console.log('🟢 WebSocket connected as', clientId);
      handshakeIdRef.current = clientId;
    });

    // ===== Transcriber connection status =====
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

    // ===== Get final transcript/translation =====
    s.on('final', transcript => {
      console.log('🟢 Final transcript received:', transcript);
      enqueueTranscript(transcript);
      dispatch(pushTranscript(transcript));
    });

    s.on('final-transleted', translation => {
      console.log('🟢 Final translation received:', translation);
      enqueueTranslation(translation);
      dispatch(pushTranslation(translation));
    });

    // ===== Response to usage:request =====
    s.on('usage:current', payload => {
      const totalMs = Number(payload?.totalMs || 0);
      const last = payload?.lastSession || {};
      const startedAt = last.startedAt || null;
      const endedAt = last.endedAt || null;
      const baseSeconds = Number(last.seconds || 0);

      setUsage({
        totalMs,
        lastSession: {
          seconds: baseSeconds,
          startedAt,
          endedAt,
        },
      });
    });

    s.on('usage:progress', payload => {
      const startedAt = payload?.startedAt || null;
      const seconds = Number(payload?.seconds || 0);
      const liveTotalMs = Number(payload?.liveTotalMs ?? NaN);

      setUsage(u => ({
        totalMs: Number.isFinite(liveTotalMs) ? liveTotalMs : u.totalMs,
        lastSession: { startedAt, endedAt: null, seconds },
      }));
    });

    s.on('usage:final', payload => {
      setUsage({
        totalMs: Number(payload?.totalMs || 0),
        lastSession: {
          seconds: Number(payload?.seconds || 0),
          startedAt: payload?.startedAt || null,
          endedAt: payload?.endedAt || null,
        },
      });
    });

    s.on('error', e => console.error('socket error:', e));

    return readyPromise;
  };

  const sendAudio = (audioData, sampleRate, sourceType) => {
    const s = socketRef.current;
    if (!s) return;

    const clientId = getOrCreateClientId();
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

  const disconnect = () => {
    const s = socketRef.current;
    if (!s) return;
    s.emit('disconnect-deepgram');
    s.disconnect();
    socketRef.current = null;
    handshakeIdRef.current = null;
  };

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
    },
  };
};

export default useSocket;
