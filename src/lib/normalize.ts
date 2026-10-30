function stripDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Canonical form for answer comparison: lowercase, no diacritics, single spaces. */
export function normalize(text: string): string {
  return stripDiacritics(text).toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * Approved alternative names for capitals where a common alternate spelling exists.
 * Keyed by the official capital name as it appears in countries.ts.
 */
const ALIASES: Record<string, string[]> = {
  'Andorra La Vieja': ['Andorra la Vella'],
  'Tiflis':           ['Tbilisi'],
  'Kiev':             ['Kyiv'],
  'Astaná':           ['Astana', 'Nur-Sultan'],
  'Chisinau':         ['Chișinău', 'Kishinev'],
  'Skopie':           ['Skopje'],
  'Vilna':            ['Vilnius'],
  'Reikiavik':        ['Reikjavík', 'Reykjavik'],
}

/**
 * Returns true when the student's answer matches the official capital name
 * (or an approved alias), ignoring case, diacritics, and whitespace.
 */
export function isCorrectAnswer(official: string, answer: string): boolean {
  if (normalize(official) === normalize(answer)) return true
  return (ALIASES[official] ?? []).some(alias => normalize(alias) === normalize(answer))
}
