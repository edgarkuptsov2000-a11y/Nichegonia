export const FIRST_UNION_TITLE = "Ничегошка Первого Созыва";
export const FIRST_UNION_PREFIX = "ПС";
export const FIRST_UNION_LIMIT = 10;

export function normalizeCitizenNumber(value?: string | null) {
  return String(value || "").trim().toUpperCase();
}

export function getFirstUnionIndex(value?: string | null) {
  const normalized = normalizeCitizenNumber(value);
  const match = normalized.match(/^ПС-(\d+)$/);

  if (!match) {
    return null;
  }

  const index = Number(match[1]);

  if (!Number.isInteger(index) || index < 1 || index > FIRST_UNION_LIMIT) {
    return null;
  }

  return index;
}

export function isFirstUnionNumber(value?: string | null) {
  return getFirstUnionIndex(value) !== null;
}

export function getCitizenDisplayStatus(value?: string | null, fallback = "Активный ничегошка") {
  return isFirstUnionNumber(value) ? FIRST_UNION_TITLE : fallback;
}
