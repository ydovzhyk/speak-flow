'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSocket from '@/app/hooks/useSocket';
import {
  getTranscriptJoined,
  getTranslationJoined,
} from '@/redux/technical/technical-selectors';

const SocketCtx = createContext(null);

export function SocketProvider({ children }) {
  const value = useSocket();
  const persistedTranscript = useSelector(getTranscriptJoined);
  const persistedTranslation = useSelector(getTranslationJoined);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
    [
      mounted,
      value.transcriptText,
      value.translationText,
      persistedTranscript,
      persistedTranslation,
    ]
  );

  return <SocketCtx.Provider value={memo}>{children}</SocketCtx.Provider>;
}

export const useSocketContext = () => {
  const ctx = useContext(SocketCtx);
  if (!ctx)
    throw new Error('useSocketContext must be used within <SocketProvider>');
  return ctx;
};
