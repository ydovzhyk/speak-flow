import { useRef } from 'react';
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
    if (user?._id) return user._id;

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

    s.on('connect', () => {
      console.log('🟢 WebSocket connected as', clientId);
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
      enqueueTranslation(translation);
      dispatch(pushTranslation(translation));
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
    // resetTranscript();
    // resetTranslation();
  };

  return {
    initialize,
    sendAudio,
    pause,
    disconnect,
    transcriptText,
    translationText,
    resetTranscript,
    resetTranslation,
  };
};

export default useSocket;
