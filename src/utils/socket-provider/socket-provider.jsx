'use client';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSocket from '@/app/hooks/useSocket';
import {
  getTranscriptJoined,
  getTranslationJoined,
} from '@/redux/technical/technical-selectors';

const SocketCtx = createContext(null);

export function SocketProvider({ children, autoconnect = false }) {
  const value = useSocket();
  const persistedTranscript = useSelector(getTranscriptJoined);
  const persistedTranslation = useSelector(getTranslationJoined);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!autoconnect) return;
    value.initialize().catch(() => {});
    return () => value.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoconnect]);

  const memo = useMemo(
    () => ({
      ...value,
      transcriptText: mounted
        ? value.transcriptText || persistedTranscript
        : '',
      translationText: mounted
        ? value.translationText || persistedTranslation
        : '',
    }),
    [mounted, value, persistedTranscript, persistedTranslation]
  );

  return <SocketCtx.Provider value={memo}>{children}</SocketCtx.Provider>;
}

export const useSocketContext = () => {
  const ctx = useContext(SocketCtx);
  if (!ctx)
    throw new Error('useSocketContext must be used within <SocketProvider>');
  return ctx;
};
