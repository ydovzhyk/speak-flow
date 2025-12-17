'use client';

import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setInputLanguage,
  setOutputLanguage,
  setLine,
} from '@/redux/technical/technical-slice';
import { LANGUAGES } from '@/data/languages';

const STORAGE_KEY = 'speakflow.settings';
const isValidLang = code => LANGUAGES.some(l => l.value === code);

const LINES = ['microphone', 'speaker', 'auto'];
const isValidLine = v => LINES.includes(v);

export default function SettingsHydrator() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const { inputLanguage, outputLanguage, line } = parsed || {};

      if (inputLanguage && isValidLang(inputLanguage)) {
        dispatch(setInputLanguage(inputLanguage));
      }

      if (outputLanguage && isValidLang(outputLanguage)) {
        dispatch(setOutputLanguage(outputLanguage));
      }

      if (line && isValidLine(line)) {
        dispatch(setLine(line));
      }
    } catch {}
  }, [dispatch]);

  return null;
}
