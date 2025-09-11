'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

const useAudioRecorder = ({ dataCb }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorderMic, setMediaRecorderMic] = useState(null);
  const [mediaRecorderSpeaker, setMediaRecorderSpeaker] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);

  // 🔹 стани-дзеркала для ререндера
  const [ctxState, setCtxState] = useState(null);
  const [micNodeState, setMicNodeState] = useState(null);
  const [spkNodeState, setSpkNodeState] = useState(null);

  // рефи WebAudio
  const sourceNodeMic = useRef(null);
  const sourceNodeSpeaker = useRef(null);
  const scriptProcessorMic = useRef(null);
  const scriptProcessorSpeaker = useRef(null);
  const audioContext = useRef(null);

  const _startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setRecordingTime(t => t + 1);
    }, 1500);
    setTimerInterval(interval);
  }, []);

  const _stopTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    setTimerInterval(null);
  }, [timerInterval]);

  const float32To16BitPCM = float32Arr => {
    const pcm16bit = new Int16Array(float32Arr.length);
    for (let i = 0; i < float32Arr.length; ++i) {
      const s = Math.max(-1, Math.min(1, float32Arr[i]));
      pcm16bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16bit;
  };

  const startRecording = async () => {
    if (timerInterval) throw new Error('timerInterval not null');

    if (!audioContext.current) {
      const AudioCtx =
        typeof window !== 'undefined' ? window.AudioContext : null;
      if (!AudioCtx) {
        console.error('Web Audio API not supported');
        return;
      }
      audioContext.current = new AudioCtx();
      setCtxState(audioContext.current);
    }

    if (audioContext.current.state === 'suspended') {
      await audioContext.current.resume();
    }

    // 1) MIC — завжди
    const streamMic = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // 2) SPEAKER — лише якщо реально є аудіо-трек із getDisplayMedia (десктоп)
    let streamSpeaker = null;
    try {
      if (navigator.mediaDevices?.getDisplayMedia) {
        const s = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        const hasAudio = s?.getAudioTracks?.().length > 0;
        if (hasAudio) streamSpeaker = s;
        else {
          toast.info('Capture tab audio not available on this device');
        }
      }
    } catch (e) {
      // користувач скасував або браузер не підтримує — просто ігноруємо спікер
    }

    // Далі створюй лише ті sourceNodes, які реально існують:
    sourceNodeMic.current =
      audioContext.current.createMediaStreamSource(streamMic);
    setMicNodeState(sourceNodeMic.current);

    if (streamSpeaker) {
      sourceNodeSpeaker.current =
        audioContext.current.createMediaStreamSource(streamSpeaker);
      setSpkNodeState(sourceNodeSpeaker.current);
    }

    // ScriptProcessor (deprecated, але працює). Призначаємо обробники ОДИН раз
    const chunkSize = 4096;
    scriptProcessorMic.current = audioContext.current.createScriptProcessor(
      chunkSize,
      1,
      1
    );
    if (streamSpeaker) {
      scriptProcessorSpeaker.current =
        audioContext.current.createScriptProcessor(chunkSize, 1, 1);
    }

    // рівні гучності для порівняння
    let lastMicLevel = 0;
    let lastSpeakerLevel = 0;

    scriptProcessorMic.current.onaudioprocess = event => {
      const float32Audio = event.inputBuffer.getChannelData(0);
      const pcm16Audio = float32To16BitPCM(float32Audio);
      lastMicLevel = pcm16Audio.reduce((acc, v) => acc + Math.abs(v), 0);
      if (!streamSpeaker || lastMicLevel >= lastSpeakerLevel) {
        dataCb(pcm16Audio, audioContext.current.sampleRate, 'mic');
      }
    };

    if (streamSpeaker) {
      scriptProcessorSpeaker.current.onaudioprocess = event => {
        const float32Audio = event.inputBuffer.getChannelData(0);
        const pcm16Audio = float32To16BitPCM(float32Audio);
        lastSpeakerLevel = pcm16Audio.reduce((acc, v) => acc + Math.abs(v), 0);
        if (lastSpeakerLevel > lastMicLevel) {
          dataCb(pcm16Audio, audioContext.current.sampleRate, 'speaker');
        }
      };
    }

    // Підключення БЕЗ звуку в динаміках (через гейн 0, щоб не було еха)
    const silentGain = audioContext.current.createGain();
    silentGain.gain.value = 0;

    sourceNodeMic.current.connect(scriptProcessorMic.current);
    scriptProcessorMic.current.connect(silentGain);
    silentGain.connect(audioContext.current.destination);

    if (streamSpeaker) {
      const silentGain2 = audioContext.current.createGain();
      silentGain2.gain.value = 0;
      sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
      scriptProcessorSpeaker.current.connect(silentGain2);
      silentGain2.connect(audioContext.current.destination);
    }

    setIsRecording(true);

    const recorderMic = new MediaRecorder(streamMic);
    recorderMic.start();
    setMediaRecorderMic(recorderMic);

    if (streamSpeaker) {
      const recorderSpeaker = new MediaRecorder(streamSpeaker);
      recorderSpeaker.start();
      setMediaRecorderSpeaker(recorderSpeaker);
    }

    _startTimer();
    return audioContext.current.sampleRate;
  };

  const stopRecording = async () => {
    scriptProcessorMic.current?.disconnect();
    scriptProcessorSpeaker.current?.disconnect();
    sourceNodeMic.current?.disconnect();
    sourceNodeSpeaker.current?.disconnect();
    mediaRecorderMic?.stop();
    mediaRecorderSpeaker?.stop();
    _stopTimer();
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);

    // (опційно) занулити стейти, якщо треба ховати візуалізери
    // setCtxState(null); setMicNodeState(null); setSpkNodeState(null);
  };

  const togglePauseResume = useCallback(() => {
    if (!audioContext.current) return;

    if (isPaused) {
      setIsPaused(false);
      mediaRecorderMic?.resume();
      mediaRecorderSpeaker?.resume();
      _startTimer();
      sourceNodeMic.current.connect(scriptProcessorMic.current);
      sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
      scriptProcessorMic.current.connect(audioContext.current.destination);
      scriptProcessorSpeaker.current.connect(audioContext.current.destination);
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorderMic?.pause();
      mediaRecorderSpeaker?.pause();
      scriptProcessorMic.current.disconnect();
      scriptProcessorSpeaker.current.disconnect();
      sourceNodeMic.current.disconnect();
      sourceNodeSpeaker.current.disconnect();
    }
  }, [
    isPaused,
    mediaRecorderMic,
    mediaRecorderSpeaker,
    _startTimer,
    _stopTimer,
  ]);

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
    recordingTime,
    // ✅ готові до передачі в UI (оновлюються через setState)
    audioContext: ctxState,
    sourceNodeMic: micNodeState,
    sourceNodeSpeaker: spkNodeState,
  };
};

export default useAudioRecorder;

// Old version of startRecording (for reference)
// 'use client';

// import { useState, useCallback, useRef } from 'react';
// import { toast } from 'react-toastify';

// const useAudioRecorder = ({ dataCb }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [mediaRecorderMic, setMediaRecorderMic] = useState(null);
//   const [mediaRecorderSpeaker, setMediaRecorderSpeaker] = useState(null);
//   const [timerInterval, setTimerInterval] = useState(null);

//   // 🔹 стани-дзеркала для ререндера
//   const [ctxState, setCtxState] = useState(null);
//   const [micNodeState, setMicNodeState] = useState(null);
//   const [spkNodeState, setSpkNodeState] = useState(null);

//   // рефи WebAudio
//   const sourceNodeMic = useRef(null);
//   const sourceNodeSpeaker = useRef(null);
//   const scriptProcessorMic = useRef(null);
//   const scriptProcessorSpeaker = useRef(null);
//   const audioContext = useRef(null);

//   const _startTimer = useCallback(() => {
//     const interval = setInterval(() => {
//       setRecordingTime(t => t + 1);
//     }, 1500);
//     setTimerInterval(interval);
//   }, []);

//   const _stopTimer = useCallback(() => {
//     if (timerInterval) clearInterval(timerInterval);
//     setTimerInterval(null);
//   }, [timerInterval]);

//   const float32To16BitPCM = float32Arr => {
//     const pcm16bit = new Int16Array(float32Arr.length);
//     for (let i = 0; i < float32Arr.length; ++i) {
//       const s = Math.max(-1, Math.min(1, float32Arr[i]));
//       pcm16bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
//     }
//     return pcm16bit;
//   };

//   const startRecording = async () => {
//     if (timerInterval) throw new Error('timerInterval not null');

//     // ініт контексту тільки після юзер-дії (клік)
//     if (!audioContext.current) {
//       const AudioCtx =
//         typeof window !== 'undefined'
//           ? window.AudioContext
//           : null;
//       if (!AudioCtx) {
//         console.error('Web Audio API not supported');
//         return;
//       }
//       audioContext.current = new AudioCtx();
//       setCtxState(audioContext.current); // 🔸 тригеримо ререндер
//     }

//     if (!navigator.mediaDevices) {
//       setIsRecording(true);
//       return 24000;
//     }

//     if (audioContext.current.state === 'suspended') {
//       await audioContext.current.resume();
//     }

//     const streamSpeaker = await navigator.mediaDevices.getDisplayMedia({
//       video: true,
//       audio: true,
//     });

//     const streamMic = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });

//     sourceNodeMic.current =
//       audioContext.current.createMediaStreamSource(streamMic);
//     sourceNodeSpeaker.current =
//       audioContext.current.createMediaStreamSource(streamSpeaker);

//     // 🔸 піднімаємо у стейт для пропів у візуалізер
//     setMicNodeState(sourceNodeMic.current);
//     setSpkNodeState(sourceNodeSpeaker.current);

//     const chunkSize = 4096;
//     scriptProcessorMic.current = audioContext.current.createScriptProcessor(
//       chunkSize,
//       1,
//       1
//     );
//     scriptProcessorSpeaker.current = audioContext.current.createScriptProcessor(
//       chunkSize,
//       1,
//       1
//     );

//     let lastMicLevel = 0;
//     let lastSpeakerLevel = 0;

//     const interval = setInterval(() => {
//       scriptProcessorMic.current.onaudioprocess = event => {
//         const float32Audio = event.inputBuffer.getChannelData(0);
//         const pcm16Audio = float32To16BitPCM(float32Audio);
//         lastMicLevel = pcm16Audio.reduce((acc, v) => acc + Math.abs(v), 0);
//         if (lastMicLevel > lastSpeakerLevel) {
//           dataCb(pcm16Audio, audioContext.current.sampleRate, 'mic');
//         }
//       };

//       scriptProcessorSpeaker.current.onaudioprocess = event => {
//         const float32Audio = event.inputBuffer.getChannelData(0);
//         const pcm16Audio = float32To16BitPCM(float32Audio);
//         lastSpeakerLevel = pcm16Audio.reduce((acc, v) => acc + Math.abs(v), 0);
//         if (lastSpeakerLevel > lastMicLevel) {
//           dataCb(pcm16Audio, audioContext.current.sampleRate, 'speaker');
//         }
//       };
//     }, 1000);

//     setTimerInterval(interval);

//     sourceNodeMic.current.connect(scriptProcessorMic.current);
//     sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
//     scriptProcessorMic.current.connect(audioContext.current.destination);
//     scriptProcessorSpeaker.current.connect(audioContext.current.destination);

//     setIsRecording(true);

//     const recorderMic = new MediaRecorder(streamMic);
//     const recorderSpeaker = new MediaRecorder(streamSpeaker);
//     setMediaRecorderMic(recorderMic);
//     setMediaRecorderSpeaker(recorderSpeaker);
//     recorderMic.start();
//     recorderSpeaker.start();
//     _startTimer();

//     return audioContext.current.sampleRate;
//   };

//   const stopRecording = async () => {
//     scriptProcessorMic.current?.disconnect();
//     scriptProcessorSpeaker.current?.disconnect();
//     sourceNodeMic.current?.disconnect();
//     sourceNodeSpeaker.current?.disconnect();
//     mediaRecorderMic?.stop();
//     mediaRecorderSpeaker?.stop();
//     _stopTimer();
//     setRecordingTime(0);
//     setIsRecording(false);
//     setIsPaused(false);

//     // (опційно) занулити стейти, якщо треба ховати візуалізери
//     // setCtxState(null); setMicNodeState(null); setSpkNodeState(null);
//   };

//   const togglePauseResume = useCallback(() => {
//     if (!audioContext.current) return;

//     if (isPaused) {
//       setIsPaused(false);
//       mediaRecorderMic?.resume();
//       mediaRecorderSpeaker?.resume();
//       _startTimer();
//       sourceNodeMic.current.connect(scriptProcessorMic.current);
//       sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
//       scriptProcessorMic.current.connect(audioContext.current.destination);
//       scriptProcessorSpeaker.current.connect(audioContext.current.destination);
//     } else {
//       setIsPaused(true);
//       _stopTimer();
//       mediaRecorderMic?.pause();
//       mediaRecorderSpeaker?.pause();
//       scriptProcessorMic.current.disconnect();
//       scriptProcessorSpeaker.current.disconnect();
//       sourceNodeMic.current.disconnect();
//       sourceNodeSpeaker.current.disconnect();
//     }
//   }, [
//     isPaused,
//     mediaRecorderMic,
//     mediaRecorderSpeaker,
//     _startTimer,
//     _stopTimer,
//   ]);

//   return {
//     startRecording,
//     stopRecording,
//     togglePauseResume,
//     isRecording,
//     isPaused,
//     recordingTime,
//     // ✅ готові до передачі в UI (оновлюються через setState)
//     audioContext: ctxState,
//     sourceNodeMic: micNodeState,
//     sourceNodeSpeaker: spkNodeState,
//   };
// };

// export default useAudioRecorder;
