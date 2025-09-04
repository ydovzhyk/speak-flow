'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSocketContext } from '@/utils/socket-provider/socket-provider';
import {
  getTypeOperationRecords,
  getSavedData,
  getHasAnyText,
} from '@/redux/technical/technical-selectors';
import {
  setTypeOperationRecords,
  clearLocalTexts,
} from '@/redux/technical/technical-slice';
import {
  saveRecord,
  getRecords,
  deleteRecord,
} from '@/redux/technical/technical-operations';
import Button from '../shared/button';
import { useTranslate } from '@/utils/translating/translating';
import { fields } from '../shared/text-field/fields';
import TextField from '../shared/text-field';
import TextareaField from '../shared/textarea-field';
import Text from '../shared/text/text';

const SaveForm = () => {
  const dispatch = useDispatch();
  const { transcriptText, translationText, resetTranscript, resetTranslation } =
    useSocketContext();

  const tTranscript = useTranslate('Transcript');
  const tTranslation = useTranslate('Translation');
  const tRequired = useTranslate('Required field');
  const tTitleMin = useTranslate('Title must have at least 2 characters');
  const tNothingToSave = useTranslate('Nothing to save yet.');

  const trimmedTranscript = (transcriptText || '').trim();
  const trimmedTranslation = (translationText || '').trim();

  const [btnStatus, setBtnStatus] = useState('Save');

  const { control, register, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      transcript: trimmedTranscript ? trimmedTranscript : '',
      translation: trimmedTranslation ? trimmedTranslation : '',
    },
  });

  const onSubmit = async data => {
    setBtnStatus('Saving...');
    const userData = {
      title: data.title.trim(),
      transcript: trimmedTranscript,
      translation: trimmedTranslation,
      savedAt: new Date().toISOString(),
    };
    try {
      await dispatch(saveRecord(userData)).unwrap();
      await dispatch(getRecords()).unwrap();
      resetTranscript();
      resetTranslation();
      dispatch(clearLocalTexts());
      setBtnStatus('Save');
      reset({ title: '', transcript: '', translation: '' });
    } catch (err) {
      setBtnStatus('Save');
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="title"
        rules={{
          required: tRequired,
          minLength: { value: 2, message: tTitleMin },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <TextField
            value={value}
            handleChange={onChange}
            error={fieldState.error}
            autoComplete="off"
            {...fields.title}
          />
        )}
      />

      {/* Read-only transcript / translation */}
      <div className="grid grid-cols-1 gap-3">
        <TextareaField
          label={tTranscript}
          name="transcript"
          register={register}
          placeholder={tNothingToSave}
          rows={3}
          showCounter={false}
        />
        <TextareaField
          label={tTranslation}
          name="translation"
          register={register}
          placeholder={tNothingToSave}
          rows={3}
          showCounter={false}
        />
      </div>

      <div className="flex items-center justify-center">
        <Button
          text={btnStatus}
          btnClass="btnDark"
          disabled={!trimmedTranscript && !trimmedTranslation}
        />
      </div>
    </form>
  );
};

const ListItem = ({ item, onDelete }) => {
  const tDelete = useTranslate('Delete');
  const tOpen = useTranslate('Open');
  const date = new Date(item.savedAt || item.date || Date.now());
  const dateStr = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="rounded-md regular-border border-opacity-50 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-end">
        <div className="text-xs text-gray-500 mb-[-8px]">{dateStr}</div>
      </div>
      <div className="font-medium">{item.title || '(no title)'}</div>
      <div className="text-xs text-gray-700 line-clamp-2">
        {item.transcript || ''}
      </div>
      <div className="h-[1px] bg-gray-300 -my-1 mx-1" />
      <div className="text-xs text-gray-700 line-clamp-2">
        {item.translation || ''}
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          text={tOpen}
          btnClass="btnPlain"
          onClick={() => window.open?.(item.link || '#', '_blank')}
        />
        <Button
          text={tDelete}
          btnClass="btnPlain"
          onClick={() => onDelete(item)}
        />
      </div>
    </div>
  );
};

const GetList = () => {
  const dispatch = useDispatch();
  const data = useSelector(getSavedData);

  const tSearchLabel = useTranslate('Search');
  const tSearchPH = useTranslate('Search by word, phrase, or date');
  const tEmpty = useTranslate('No saved records yet.');
  const tNoResult = useTranslate('No results match your filters.');

  const list = Array.isArray(data) ? data : data?.items || [];

  const [query, setQuery] = useState('');

  const matchDate = (q, savedAt) => {
    if (!q) return false;
    const d = new Date(savedAt || 0);
    if (Number.isNaN(d.getTime())) return false;

    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    const candidates = [
      `${yyyy}`, // 2025
      `${yyyy}-${mm}`, // 2025-09
      `${yyyy}-${mm}-${dd}`, // 2025-09-03
      `${dd}.${mm}.${yyyy}`, // 03.09.2025
      `${mm}/${dd}/${yyyy}`, // 09/03/2025
    ];

    const qNorm = q.toLowerCase();
    return candidates.some(c => c.toLowerCase().includes(qNorm));
  };

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return list;

    const hit = s => (s ? String(s).toLowerCase().includes(q) : false);

    return list.filter(
      it =>
        hit(it.title) ||
        hit(it.transcript) ||
        hit(it.translation) ||
        matchDate(q, it.savedAt || it.date)
    );
  }, [list, query]);

  const onDelete = async item => {
    await dispatch(deleteRecord(item._id || item.id)).unwrap();
    await dispatch(getRecords()).unwrap();
  };

  if (!list || list.length === 0) {
    return <div className="text-sm text-gray-600">{tEmpty}</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex-1 flex flex-col gap-2">
        <Text type="tiny" as="span" fontWeight="normal">
          {tSearchLabel}
        </Text>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={tSearchPH}
          aria-label={tSearchLabel}
          className="w-full pl-[10px] rounded-[5px] h-[40px] bg-white font-normal text-[14px] regular-border border-opacity-50 transition-all duration-300 ease-in-out outline-none"
        />
      </label>

      {filtered.length === 0 ? (
        <div className="text-sm text-gray-600">{tNoResult}</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(item => (
            <ListItem
              key={item._id || item.id}
              item={item}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Records = () => {
  const dispatch = useDispatch();
  const typeOperation = useSelector(getTypeOperationRecords);
  const hasAnyText = useSelector(getHasAnyText);

  const effectiveType = typeOperation ?? 'GetRecords';

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-[40px] flex flex-row justify-around gap-[2px]">
        <div
          className={`w-[calc(50%-2px)] rounded-t-md border border-[rgba(82,85,95,0.2)] flex justify-center items-center ${
            effectiveType === 'GetRecords' ? 'border-b-0' : ''
          }`}
        >
          <Button
            btnClass="btnPlain"
            text="Get Records"
            onClick={() => dispatch(setTypeOperationRecords('GetRecords'))}
            textColor="text-black"
          />
        </div>
        <div
          className={`w-[calc(50%-2px)] rounded-t-md border border-[rgba(82,85,95,0.2)] flex justify-center items-center ${
            effectiveType === 'SaveRecords' ? 'border-b-0' : ''
          }`}
        >
          <Button
            btnClass="btnPlain"
            text="Save Records"
            onClick={() => dispatch(setTypeOperationRecords('SaveRecords'))}
            textColor="text-black"
          />
        </div>
      </div>

      <div className="min-h-[calc(100%-40px)] w-full flex flex-col gap-5 pt-9 px-5 pb-5 border-x border-b border-[rgba(15,54,181,0.2)] rounded-b-md">
        {effectiveType === 'GetRecords' ? (
          <GetList />
        ) : (
          <SaveForm key={String(hasAnyText)} />
        )}
      </div>
    </div>
  );
};

export default Records;
