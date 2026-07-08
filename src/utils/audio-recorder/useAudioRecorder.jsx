'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

// ---- helpers --------------------------------------------------------------

const isSecureContextOk = () =>
  typeof window !== 'undefined' &&
  (window.isSecureContext || location.hostname === 'localhost');

const getUserMediaAny = async constraints => {
  if (typeof navigator === 'undefined') throw new Error('No navigator');
  const md = navigator.mediaDevices;
  if (md?.getUserMedia) return md.getUserMedia(constraints);
  const legacy =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  if (legacy) {
    return new Promise((res, rej) =>
      legacy.call(navigator, constraints, res, rej)
    );
  }
  throw new Error('getUserMedia unavailable');
};

const createAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  return AC ? new AC() : null;
};

const VALID_MODES = ['microphone', 'speaker', 'auto'];
const normalizeMode = m => (VALID_MODES.includes(m) ? m : 'speaker');

// ---- hook ----------------------------------------------------------------

const useAudioRecorder = ({
  dataCb,
  mode = 'speaker',
  onActiveChannelChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorderMic, setMediaRecorderMic] = useState(null);
  const [mediaRecorderSpeaker, setMediaRecorderSpeaker] = useState(null);

  // для UI/візуалізерів
  const [ctxState, setCtxState] = useState(null);
  const [micNodeState, setMicNodeState] = useState(null);
  const [spkNodeState, setSpkNodeState] = useState(null);
  const [audioGraphEpoch, setAudioGraphEpoch] = useState(0);

  // refs
  const audioContext = useRef(null);
  const sourceNodeMic = useRef(null);
  const sourceNodeSpeaker = useRef(null);
  const scriptProcessorMic = useRef(null);
  const scriptProcessorSpeaker = useRef(null);
  const micStreamRef = useRef(null);
  const spkStreamRef = useRef(null);
  const silentGainMicRef = useRef(null);
  const silentGainSpeakerRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // режим може мінятись під час запису — тримаємо в ref
  const modeRef = useRef(normalizeMode(mode));
  modeRef.current = normalizeMode(mode);

  // активний канал (для UI)
  const activeChannelRef = useRef('speaker');
  const setActiveChannel = ch => {
    if (activeChannelRef.current !== ch) {
      activeChannelRef.current = ch;
      onActiveChannelChange?.(ch);
    }
  };

  const _startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(
      () => setRecordingTime(t => t + 1),
      1000
    );
  }, []);

  const _stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const float32To16BitPCM = float32Arr => {
    const pcm16bit = new Int16Array(float32Arr.length);
    for (let i = 0; i < float32Arr.length; ++i) {
      const s = Math.max(-1, Math.min(1, float32Arr[i]));
      pcm16bit[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16bit;
  };

  const startRecording = async () => {
    if (timerIntervalRef.current) throw new Error('timerInterval not null');

    if (!isSecureContextOk()) {
      toast.error(
        'Microphone requires HTTPS. Open the site via https (e.g. ngrok/cloudflared).'
      );
      return;
    }

    if (!audioContext.current) {
      const ac = createAudioContext();
      if (!ac) {
        toast.error('Web Audio API not supported in this browser');
        return;
      }
      audioContext.current = ac;
      setCtxState(ac);
    }
    if (audioContext.current.state === 'suspended') {
      await audioContext.current.resume();
    }

    try {
      // 1) MIC — завжди
      const streamMic = await getUserMediaAny({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micStreamRef.current = streamMic;

      // 2) SPEAKER — через getDisplayMedia (частіше desktop)
      let streamSpeaker = null;
      try {
        if (navigator.mediaDevices?.getDisplayMedia) {
          const s = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          const hasAudio = s?.getAudioTracks?.().length > 0;
          if (hasAudio) {
            streamSpeaker = s;
            spkStreamRef.current = s;
          } else {
            toast.info('Tab/system audio capture not available on this device');
          }
        }
      } catch {
        // cancel / unsupported
      }

      // якщо користувач обрав speaker, а його нема — фолбек (і пояснення)
      if (modeRef.current === 'speaker' && !streamSpeaker) {
        toast.info('Speaker capture is not available here. Using microphone.');
        modeRef.current = 'microphone';
      }

      // 🔊 Nodes
      sourceNodeMic.current =
        audioContext.current.createMediaStreamSource(streamMic);
      setMicNodeState(sourceNodeMic.current);

      if (streamSpeaker) {
        sourceNodeSpeaker.current =
          audioContext.current.createMediaStreamSource(streamSpeaker);
        setSpkNodeState(sourceNodeSpeaker.current);
      } else {
        sourceNodeSpeaker.current = null;
        setSpkNodeState(null);
      }

      const chunkSize = 4096;
      scriptProcessorMic.current = audioContext.current.createScriptProcessor(
        chunkSize,
        1,
        1
      );
      if (streamSpeaker) {
        scriptProcessorSpeaker.current =
          audioContext.current.createScriptProcessor(chunkSize, 1, 1);
      } else {
        scriptProcessorSpeaker.current = null;
      }

      let lastMicLevel = 0;
      let lastSpeakerLevel = 0;

      // MIC channel
      scriptProcessorMic.current.onaudioprocess = event => {
        const float32Audio = event.inputBuffer.getChannelData(0);
        const pcm16Audio = float32To16BitPCM(float32Audio);
        lastMicLevel = pcm16Audio.reduce((acc, v) => acc + Math.abs(v), 0);

        const m = modeRef.current;

        if (m === 'microphone') {
          setActiveChannel('microphone');
          dataCb(pcm16Audio, audioContext.current.sampleRate, 'microphone');
          return;
        }

        if (m === 'auto') {
          // якщо спікера нема — auto => mic
          if (!streamSpeaker || lastMicLevel >= lastSpeakerLevel) {
            setActiveChannel('microphone');
            dataCb(pcm16Audio, audioContext.current.sampleRate, 'microphone');
          }
        }

        // m === 'speaker' => mic не шлемо
      };

      // SPEAKER channel
      if (streamSpeaker && scriptProcessorSpeaker.current) {
        scriptProcessorSpeaker.current.onaudioprocess = event => {
          const float32Audio = event.inputBuffer.getChannelData(0);
          const pcm16Audio = float32To16BitPCM(float32Audio);
          lastSpeakerLevel = pcm16Audio.reduce(
            (acc, v) => acc + Math.abs(v),
            0
          );

          const m = modeRef.current;

          if (m === 'speaker') {
            setActiveChannel('speaker');
            dataCb(pcm16Audio, audioContext.current.sampleRate, 'speaker');
            return;
          }

          if (m === 'auto') {
            if (lastSpeakerLevel > lastMicLevel) {
              setActiveChannel('speaker');
              dataCb(pcm16Audio, audioContext.current.sampleRate, 'speaker');
            }
          }

          // m === 'microphone' => speaker не шлемо
        };
      }

      // Підключення без звуку (щоб не було еха)
      silentGainMicRef.current = audioContext.current.createGain();
      silentGainMicRef.current.gain.value = 0;

      sourceNodeMic.current.connect(scriptProcessorMic.current);
      scriptProcessorMic.current.connect(silentGainMicRef.current);
      silentGainMicRef.current.connect(audioContext.current.destination);

      if (
        streamSpeaker &&
        sourceNodeSpeaker.current &&
        scriptProcessorSpeaker.current
      ) {
        silentGainSpeakerRef.current = audioContext.current.createGain();
        silentGainSpeakerRef.current.gain.value = 0;
        sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
        scriptProcessorSpeaker.current.connect(silentGainSpeakerRef.current);
        silentGainSpeakerRef.current.connect(audioContext.current.destination);
      } else {
        silentGainSpeakerRef.current = null;
      }

      setIsRecording(true);

      // MediaRecorder — опційно
      try {
        const recMic = new MediaRecorder(streamMic);
        recMic.start();
        setMediaRecorderMic(recMic);
      } catch {}

      if (streamSpeaker) {
        try {
          const recSpk = new MediaRecorder(streamSpeaker);
          recSpk.start();
          setMediaRecorderSpeaker(recSpk);
        } catch {}
      }

      _startTimer();
      return audioContext.current.sampleRate;
    } catch (err) {
      const msg =
        err?.name === 'NotAllowedError'
          ? 'Microphone permission denied'
          : err?.name === 'NotFoundError'
            ? 'No microphone found'
            : err?.message || 'getUserMedia failed';
      toast.error(msg);
      throw err;
    }
  };

  const stopRecording = async () => {
    scriptProcessorMic.current?.disconnect?.();
    scriptProcessorSpeaker.current?.disconnect?.();
    sourceNodeMic.current?.disconnect?.();
    sourceNodeSpeaker.current?.disconnect?.();

    mediaRecorderMic?.stop?.();
    mediaRecorderSpeaker?.stop?.();

    micStreamRef.current?.getTracks?.().forEach(t => t.stop());
    spkStreamRef.current?.getTracks?.().forEach(t => t.stop());
    micStreamRef.current = null;
    spkStreamRef.current = null;
    silentGainMicRef.current = null;
    silentGainSpeakerRef.current = null;

    _stopTimer();
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

  const disconnectProcessingChain = () => {
    try {
      sourceNodeMic.current?.disconnect(scriptProcessorMic.current);
    } catch {}
    try {
      scriptProcessorMic.current?.disconnect();
    } catch {}

    if (sourceNodeSpeaker.current && scriptProcessorSpeaker.current) {
      try {
        sourceNodeSpeaker.current.disconnect(scriptProcessorSpeaker.current);
      } catch {}
      try {
        scriptProcessorSpeaker.current.disconnect();
      } catch {}
    }
  };

  const connectProcessingChain = () => {
    if (
      sourceNodeMic.current &&
      scriptProcessorMic.current &&
      silentGainMicRef.current
    ) {
      try {
        sourceNodeMic.current.connect(scriptProcessorMic.current);
      } catch {}
      try {
        scriptProcessorMic.current.connect(silentGainMicRef.current);
      } catch {}
    }

    if (
      sourceNodeSpeaker.current &&
      scriptProcessorSpeaker.current &&
      silentGainSpeakerRef.current
    ) {
      try {
        sourceNodeSpeaker.current.connect(scriptProcessorSpeaker.current);
      } catch {}
      try {
        scriptProcessorSpeaker.current.connect(silentGainSpeakerRef.current);
      } catch {}
    }
  };

  const togglePauseResume = useCallback(() => {
    if (!audioContext.current) return;

    if (isPaused) {
      setIsPaused(false);
      mediaRecorderMic?.resume?.();
      mediaRecorderSpeaker?.resume?.();
      _startTimer();

      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume().catch(() => {});
      }

      connectProcessingChain();
      setAudioGraphEpoch(epoch => epoch + 1);
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorderMic?.pause?.();
      mediaRecorderSpeaker?.pause?.();
      disconnectProcessingChain();
    }
  }, [
    _startTimer,
    _stopTimer,
    isPaused,
    mediaRecorderMic,
    mediaRecorderSpeaker,
  ]);

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecording,
    isPaused,
    recordingTime,
    audioContext: ctxState,
    sourceNodeMic: micNodeState,
    sourceNodeSpeaker: spkNodeState,
    audioGraphEpoch,
  };
};

export default useAudioRecorder;