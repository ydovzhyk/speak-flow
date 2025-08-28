'use client';

import { createContext, useContext, useMemo } from 'react';
import useSocket from '@/app/hooks/useSocket';

const SocketCtx = createContext(null);

export function SocketProvider({ children }) {
  const value = useSocket();
  const memo = useMemo(
    () => value,
    [value.transcriptText, value.translationText]
  );
  return <SocketCtx.Provider value={memo}>{children}</SocketCtx.Provider>;
}

export const useSocketContext = () => {
  const ctx = useContext(SocketCtx);
  if (!ctx)
    throw new Error('useSocketContext must be used within <SocketProvider>');
  return ctx;
};
