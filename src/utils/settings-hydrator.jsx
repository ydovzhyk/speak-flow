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

const LABEL_TO_CODE = Object.fromEntries(
  LANGUAGES.map(({ label, value }) => [label.toLowerCase(), value])
);

const normalizeLang = value => {
  if (!value) return null;
  if (isValidLang(value)) return value;
  const code = LABEL_TO_CODE[String(value).trim().toLowerCase()];
  return code && isValidLang(code) ? code : null;
};

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

      const normalizedInput = normalizeLang(inputLanguage);
      if (normalizedInput) {
        dispatch(setInputLanguage(normalizedInput));
      }

      const normalizedOutput = normalizeLang(outputLanguage);
      if (normalizedOutput) {
        dispatch(setOutputLanguage(normalizedOutput));
      }

      if (line && isValidLine(line)) {
        dispatch(setLine(line));
      }
    } catch {}
  }, [dispatch]);

  return null;
}
