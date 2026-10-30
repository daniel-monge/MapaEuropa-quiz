import type { Country } from '../data/countries.ts'
import { COUNTRIES } from '../data/countries.ts'
import type { Progress } from './progress.ts'
import { accuracy } from './progress.ts'

export type QuestionType = 'country-to-capital' | 'capital-to-country' | 'country-to-map'
export type SessionMode = 'country-to-capital' | 'capital-to-country' | 'mixed' | 'review' | 'country-to-map'

export interface Question {
  type: QuestionType
  country: Country
  options: string[]
}

export interface SessionResult {
  countryId: number
  questionType: QuestionType
  correct: boolean
  given: string
}

export const SESSION_LENGTH = 10
export const OPTIONS_COUNT = 4

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions(correct: Country): string[] {
  const others = shuffle(COUNTRIES)
    .filter(c => c.id !== correct.id)
    .slice(0, OPTIONS_COUNT - 1)
    .map(c => c.name)
  return shuffle([correct.name, ...others])
}

function pickCountries(mode: SessionMode, progress: Progress): Country[] {
  if (mode !== 'review') {
    return shuffle(COUNTRIES).slice(0, SESSION_LENGTH)
  }

  const errorIds = new Set(progress.recentErrors)
  const errorCountries = COUNTRIES.filter(c => errorIds.has(c.id))
  const others = COUNTRIES
    .filter(c => !errorIds.has(c.id))
    .sort((a, b) => accuracy(progress.countries[a.id]) - accuracy(progress.countries[b.id]))

  return [...errorCountries, ...others].slice(0, SESSION_LENGTH)
}

function questionType(mode: SessionMode, index: number): QuestionType {
  if (mode === 'country-to-capital') return 'country-to-capital'
  if (mode === 'capital-to-country') return 'capital-to-country'
  if (mode === 'country-to-map')     return 'country-to-map'
  return index % 2 === 0 ? 'country-to-capital' : 'capital-to-country'
}

export function generateSession(mode: SessionMode, progress: Progress): Question[] {
  const countries = pickCountries(mode, progress)
  return countries.map((country, i): Question => {
    const type = questionType(mode, i)
    return {
      type,
      country,
      options: type === 'capital-to-country' ? buildOptions(country) : [],
    }
  })
}
