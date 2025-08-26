'use client';

import SelectField from '@/components/shared/select-field/select-field';
import { useEffect, useState } from 'react';
import translate from 'translate';
import { useLanguage } from './language-context';
import languagesAndCodes from './languagesAndCodes';

translate.key = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY || '';
const STORAGE_KEY = 'speakflow.settings';

function readSettings() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSettings(patch) {
  if (typeof window === 'undefined') return;
  try {
    const prev = readSettings();
    const next = { ...prev, ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
  }
}

export default function TranslateMe() {
  const { updateLanguageIndex } = useLanguage();
  const [languageIndex, setLanguageIndex] = useState(0);

  useEffect(() => {
    const { selectedIndex } = readSettings();
    const idxNum = Number(selectedIndex);
    const maxIndex = (languagesAndCodes.languages?.length || 1) - 1;

    if (!Number.isNaN(idxNum) && idxNum >= 0 && idxNum <= maxIndex) {
      setLanguageIndex(idxNum);
      updateLanguageIndex(idxNum);
    }
  }, [updateLanguageIndex]);

  const options = languagesAndCodes.languages.map((language, index) => ({
    value: String(index),
    label: language.lang,
  }));

  const handleChange = selectedOption => {
    const idx = Number(selectedOption?.value);
    if (Number.isNaN(idx)) return;

    setLanguageIndex(idx);
    updateLanguageIndex(idx);

    writeSettings({ selectedIndex: idx });
  };

  return (
    <div>
      <SelectField
        name="language"
        value={options[languageIndex] || options[0]}
        handleChange={handleChange}
        placeholder="Language"
        required
        options={options}
        width="135px"
        topPlaceholder={false}
      />
    </div>
  );
}

export async function translateMyText(text = '', languageIndex) {
  const { languages } = languagesAndCodes;
  const lang = languages[languageIndex];

  if (lang) {
    const result = await translate(text, lang.code);
    return result;
  } else {
    throw new Error('Language not found');
  }
}

export const useTranslate = text => {
  const [translatedText, setTranslatedText] = useState(text);
  const { languageIndex } = useLanguage();

  const normalizeCase = text => {
    if (typeof text === 'string') {
      return text.replace(
        /(^|\.\s+)([a-z])/g,
        (_, prefix, letter) => prefix + letter.toUpperCase()
      );
    }

    if (Array.isArray(text)) {
      return text
        .join('')
        .replace(
          /(^|\.\s+)([a-z])/g,
          (_, prefix, letter) => prefix + letter.toUpperCase()
        );
    }

    return '';
  };

  useEffect(() => {
    translateMyText(text, languageIndex)
      .then(res => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(res)) {
          setTranslatedText(res);
        } else {
          setTranslatedText(normalizeCase(res));
        }
      })
      .catch(err => console.log(err));
  }, [text, languageIndex]);

  return translatedText;
};

export const TranslatedText = ({ text }) => {
  const translatedText = useTranslate(text);
  return <>{translatedText}</>;
};
