import languageData from '@/utils/translating/languagesAndCodes';

const list = languageData.languages || [];

const norm = s =>
  String(s || '')
    .trim()
    .toLowerCase();

// попередньо будуємо мапи для швидкого пошуку
const codeToName = new Map(list.map(({ code, lang }) => [norm(code), lang]));
const nameToName = new Map(list.map(({ lang }) => [norm(lang), lang]));

/**
 * Повертає повну назву мови з languageData за кодом ('uk') або назвою ('Ukrainian').
 * Якщо не знайдено — повертає вхідне значення або '—'.
 */
export function getLangLabel(value) {
  const v = norm(value);
  if (!v) return '—';

  if (codeToName.has(v)) return codeToName.get(v); // 'uk' -> 'Ukrainian'
  if (nameToName.has(v)) return nameToName.get(v); // 'ukrainian' -> 'Ukrainian'

  // поблажливий пошук (напівзбіги/варіанти назв типу 'Portuguese(Portugal, Brazil)')
  const hit = list.find(
    ({ code, lang }) =>
      norm(code) === v ||
      norm(lang) === v ||
      norm(lang).startsWith(v) ||
      v.startsWith(norm(lang))
  );
  return hit?.lang || value || '—';
}
