export interface CountryStats {
  seen: number
  correct: number
}

export interface Progress {
  countries: Record<number, CountryStats>
  recentErrors: number[]
}

const STORAGE_KEY = 'mapa-europa-progress'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { countries: {}, recentErrors: [] }
    return JSON.parse(raw) as Progress
  } catch {
    return { countries: {}, recentErrors: [] }
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // storage blocked or full – fail silently
  }
}

export function recordAnswers(
  progress: Progress,
  results: Array<{ countryId: number; correct: boolean }>,
): Progress {
  const countries = { ...progress.countries }
  const recentErrors: number[] = []

  for (const { countryId, correct } of results) {
    const prev = countries[countryId] ?? { seen: 0, correct: 0 }
    countries[countryId] = {
      seen: prev.seen + 1,
      correct: prev.correct + (correct ? 1 : 0),
    }
    if (!correct) recentErrors.push(countryId)
  }

  return { countries, recentErrors }
}

export function accuracy(stats: CountryStats | undefined): number {
  if (!stats || stats.seen === 0) return 0
  return stats.correct / stats.seen
}
