export type LengthKind = 'coil' | 'fixed';

export interface ParsedSize {
  sizeAmm: number | null;
  sizeBmm: number | null;
  sizeNote: string | null;
  isDiameterFormat: boolean;
}

/**
 * Парсинг поля "Габаритные размеры, мм".
 * Поддерживаем форматы:
 * - "AхB мм"
 * - "A x B мм"
 * - "ø AхB"
 * - текст в скобках, например "(с развальцовкой)"
 */
export function parseSize(raw: string | null | undefined): ParsedSize {
  if (!raw) {
    return { sizeAmm: null, sizeBmm: null, sizeNote: null, isDiameterFormat: false };
  }

  let sizeRaw = raw.trim();
  if (!sizeRaw) {
    return { sizeAmm: null, sizeBmm: null, sizeNote: null, isDiameterFormat: false };
  }

  let sizeNote: string | null = null;

  // Отделяем примечание в скобках
  const parenIndex = sizeRaw.indexOf('(');
  if (parenIndex !== -1) {
    const base = sizeRaw.slice(0, parenIndex).trim();
    const note = sizeRaw.slice(parenIndex).trim();
    sizeRaw = base;
    sizeNote = note;
  }

  // Формат с "ø"
  let isDiameterFormat = false;
  const diameterMatch = sizeRaw.match(/^[øØ]\s*(.*)$/);
  if (diameterMatch) {
    isDiameterFormat = true;
    sizeRaw = diameterMatch[1].trim();
    if (!sizeNote) {
      sizeNote = 'ø';
    } else if (!sizeNote.includes('ø')) {
      sizeNote = 'ø ' + sizeNote;
    }
  }

  // Убираем "мм"/"mm"
  sizeRaw = sizeRaw
    .replace(/мм/gi, '')
    .replace(/mm/gi, '')
    .trim();

  if (!sizeRaw) {
    return { sizeAmm: null, sizeBmm: null, sizeNote, isDiameterFormat };
  }

  // Запятые -> точки
  sizeRaw = sizeRaw.replace(/,/g, '.');

  // Разделяем по "х"/"x" (кириллица/латиница)
  const parts = sizeRaw
    .split(/[xх]/i)
    .map(p => p.trim())
    .filter(Boolean);

  const parseNum = (s: string): number | null => {
    const m = s.match(/(\d+(\.\d+)?)/);
    if (!m) return null;
    const n = parseFloat(m[1]);
    return Number.isFinite(n) ? n : null;
  };

  const sizeAmm = parts[0] ? parseNum(parts[0]) : null;
  const sizeBmm = parts[1] ? parseNum(parts[1]) : null;

  return { sizeAmm, sizeBmm, sizeNote, isDiameterFormat };
}

export interface ParsedLength {
  kind: LengthKind;
  lengthMm: number | null;
  toleranceRaw: string | null;
}

/**
 * Парсинг поля "Длина изделия".
 * Правила:
 * - если содержит "поставка в бухтах" -> kind="coil"
 * - иначе kind="fixed"
 * - lengthMm — первое число
 * - toleranceRaw — хвост после числа без "мм"
 */
export function parseLength(raw: string | null | undefined): ParsedLength {
  if (!raw) {
    return { kind: 'fixed', lengthMm: null, toleranceRaw: null };
  }

  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes('поставка в бухтах')) {
    return { kind: 'coil', lengthMm: null, toleranceRaw: null };
  }

  const numMatch = trimmed.match(/(\d+(?:[.,]\d+)?)/);
  if (!numMatch) {
    return { kind: 'fixed', lengthMm: null, toleranceRaw: null };
  }

  const numStr = numMatch[1].replace(',', '.');
  const lengthMm = parseFloat(numStr);

  let rest = trimmed.slice(numMatch.index! + numMatch[1].length);
  rest = rest.replace(/мм/gi, '').replace(/mm/gi, '').trim();
  const toleranceRaw = rest || null;

  return {
    kind: 'fixed',
    lengthMm: Number.isFinite(lengthMm) ? lengthMm : null,
    toleranceRaw,
  };
}
