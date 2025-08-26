'use client';

import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setInputLanguage,
  setOutputLanguage,
} from '@/redux/technical/technical-slice';
import { getInputLanguage, getOutputLanguage } from '@/redux/technical/technical-selectors';
import SelectField from '@/components/shared/select-field/select-field';
import Text from '@/components/shared/text/text';
import { LANGUAGES } from '../../data/languages';

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

const SelectLanguagePanel = () => {
  const dispatch = useDispatch();
  const inputLanguage = useSelector(getInputLanguage);
  const outputLanguage = useSelector(getOutputLanguage);

  useEffect(() => {
    writeSettings({ inputLanguage, outputLanguage });
  }, [inputLanguage, outputLanguage]);

  const inputValue = useMemo(
    () => LANGUAGES.find(o => o.value === inputLanguage) || LANGUAGES[0],
    [inputLanguage]
  );
  const outputValue = useMemo(
    () => LANGUAGES.find(o => o.value === outputLanguage) || LANGUAGES[0],
    [outputLanguage]
  );

  const handleChangeInput = useCallback(
    opt => {
      if (opt?.value) dispatch(setInputLanguage(opt.value));
    },
    [dispatch]
  );
  const handleChangeOutput = useCallback(
    opt => {
      if (opt?.value) dispatch(setOutputLanguage(opt.value));
    },
    [dispatch]
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <Text type="tiny" as="p" fontWeight="light">
        Choose the language you’re recording in and the language you want the
        transcript in.
      </Text>

      <div className="w-full flex items-center">
        <Text
          type="tiny"
          as="p"
          fontWeight="normal"
          className="text-[var(--text-main)]"
        >
          Input language
        </Text>
        <div className="ml-auto">
          <SelectField
            name="inputLanguage"
            value={inputValue}
            handleChange={handleChangeInput}
            placeholder="Input language"
            required
            options={LANGUAGES}
            width={130}
            topPlaceholder={false}
            textColor="black"
            textAlign="center"
          />
        </div>
      </div>

      <div className="w-full flex items-center">
        <Text
          type="tiny"
          as="p"
          fontWeight="normal"
          className="text-[var(--text-main)]"
        >
          Output language
        </Text>
        <div className="ml-auto">
          <SelectField
            name="outputLanguage"
            value={outputValue}
            handleChange={handleChangeOutput}
            placeholder="Output language"
            required
            options={LANGUAGES}
            width={130}
            topPlaceholder={false}
            textColor="black"
            textAlign="center"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectLanguagePanel;
