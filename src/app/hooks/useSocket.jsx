import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  // addSentenceTranscript,
  // addSentenceTranslated,
  setRecordBtn,
  setDeepgramStatus,
} from '@/redux/technical/technical-slice';
import {
  getInputLanguage,
  getOutputLanguage,
} from '@/redux/technical/technical-selectors';
import { useStreamingParagraph } from '@/utils/useStreamingParagraph';

// const serverURL = "http://localhost:4000";
const serverURL = "wss://test-task-backend-34db7d47d9c8.herokuapp.com";

const subscriptions = [
  "final",
  "final-transleted",
  "partial",
  "transcriber-ready",
  "error",
  "close",
];

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const outputLanguage = useSelector(getOutputLanguage);
  const inputLanguage = useSelector(getInputLanguage);

  const {
    displayedText: transcriptText,
    enqueueSentence: enqueueTranscript,
    pause: pauseTranscript,
    reset: resetTranscript,
  } = useStreamingParagraph(22);

  const {
    displayedText: translationText,
    enqueueSentence: enqueueTranslation,
    pause: pauseTranslation,
    reset: resetTranslation,
  } = useStreamingParagraph(22);

  const initialize = () => {
    if (!socketRef.current) {
      socketRef.current = io(serverURL);

      socketRef.current.on('connect', () => {
        console.log('connected to WS server');

        subscriptions.forEach(event => {
          socketRef.current.on(event, data => {
            if (event === 'transcriber-ready' && data === 'Ready') {
              dispatch(setDeepgramStatus(true));
              dispatch(setRecordBtn(true));
            }

            if (event === 'close' && data === 'Deepgram connection is closed') {
              dispatch(setDeepgramStatus(false));
            }

            socket.on('final', transcript => {
              enqueueTranscript(transcript);
              // dispatch(addSentenceTranscript(transcript));
            });

            socket.on('final-transleted', translation => {
              enqueueTranslation(translation);
              // dispatch(addSentenceTranslated(translation));
            });
          });
        });
      });
    } else {
      return;
    }
  };

  const sendAudio = (audioData, sampleRate, sourceType) => {
    if (socketRef.current) {
      // console.log(sourceType);
      socketRef.current.emit('incoming-audio', {
        audioData,
        sampleRate,
        sourceType,
        outputLanguage,
        inputLanguage,
      });
    }
  };

  const pause = async data => {
    if (socketRef.current) {
      socketRef.current.emit('pause-deepgram', data);
    }
  };

  const disconnect = async () => {
    if (socketRef.current) {
      socketRef.current.emit('diconnect-deepgram');
    }
  };

  return {
    initialize,
    sendAudio,
    pause,
    disconnect,
    transcriptText,
    translationText,
  };
};

export default useSocket;
