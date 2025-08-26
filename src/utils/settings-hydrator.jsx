'use client';

import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setInputLanguage,
  setOutputLanguage,
} from '@/redux/technical/technical-slice';
import { LANGUAGES } from '@/data/languages';

const STORAGE_KEY = 'speakflow.settings';
const isValid = code => LANGUAGES.some(l => l.value === code);

export default function SettingsHydrator() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const { inputLanguage, outputLanguage } = parsed || {};

      if (inputLanguage && isValid(inputLanguage)) {
        dispatch(setInputLanguage(inputLanguage));
      }
      if (outputLanguage && isValid(outputLanguage)) {
        dispatch(setOutputLanguage(outputLanguage));
      }
    } catch {
    }
  }, [dispatch]);

  return null;
}
