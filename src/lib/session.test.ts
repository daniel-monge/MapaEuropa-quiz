import { describe, it, expect } from 'vitest'
import { generateSession, SESSION_LENGTH, OPTIONS_COUNT } from './session.ts'
import { COUNTRIES } from '../data/countries.ts'

const emptyProgress = { countries: {}, recentErrors: [] }

describe('generateSession – country-to-capital', () => {
  it('returns SESSION_LENGTH questions', () => {
    expect(generateSession('country-to-capital', emptyProgress)).toHaveLength(SESSION_LENGTH)
  })

  it('all questions are type country-to-capital', () => {
    generateSession('country-to-capital', emptyProgress)
      .forEach(q => expect(q.type).toBe('country-to-capital'))
  })

  it('all countries come from the temario', () => {
    const validIds = new Set(COUNTRIES.map(c => c.id))
    generateSession('country-to-capital', emptyProgress)
      .forEach(q => expect(validIds.has(q.country.id)).toBe(true))
  })

  it('no country appears twice in a session', () => {
    const ids = generateSession('country-to-capital', emptyProgress).map(q => q.country.id)
    expect(new Set(ids).size).toBe(SESSION_LENGTH)
  })

  it('text questions have no options', () => {
    generateSession('country-to-capital', emptyProgress)
      .forEach(q => expect(q.options).toHaveLength(0))
  })
})

describe('generateSession – capital-to-country', () => {
  it('all questions are type capital-to-country', () => {
    generateSession('capital-to-country', emptyProgress)
      .forEach(q => expect(q.type).toBe('capital-to-country'))
  })

  it('each question has OPTIONS_COUNT options', () => {
    generateSession('capital-to-country', emptyProgress)
      .forEach(q => expect(q.options).toHaveLength(OPTIONS_COUNT))
  })

  it('correct country is always among the options', () => {
    generateSession('capital-to-country', emptyProgress)
      .forEach(q => expect(q.options).toContain(q.country.name))
  })

  it('no duplicate options within a question', () => {
    generateSession('capital-to-country', emptyProgress)
      .forEach(q => expect(new Set(q.options).size).toBe(OPTIONS_COUNT))
  })

  it('all options are valid country names from the temario', () => {
    const validNames = new Set(COUNTRIES.map(c => c.name))
    generateSession('capital-to-country', emptyProgress)
      .forEach(q => q.options.forEach(opt => expect(validNames.has(opt)).toBe(true)))
  })
})

describe('generateSession – mixed', () => {
  it('contains both question types', () => {
    const types = new Set(generateSession('mixed', emptyProgress).map(q => q.type))
    expect(types.has('country-to-capital')).toBe(true)
    expect(types.has('capital-to-country')).toBe(true)
  })
})

describe('generateSession – review', () => {
  it('always includes countries from recentErrors', () => {
    const progress = { countries: {}, recentErrors: [1, 2, 3] }
    const ids = generateSession('review', progress).map(q => q.country.id)
    expect(ids).toContain(1)
    expect(ids).toContain(2)
    expect(ids).toContain(3)
  })

  it('fills to SESSION_LENGTH when recentErrors < SESSION_LENGTH', () => {
    const progress = { countries: {}, recentErrors: [1, 2] }
    expect(generateSession('review', progress)).toHaveLength(SESSION_LENGTH)
  })
})
