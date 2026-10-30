/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { loadProgress, saveProgress, recordAnswers, accuracy } from './progress.ts'

beforeEach(() => {
  localStorage.clear()
})

describe('loadProgress', () => {
  it('returns empty progress when nothing stored', () => {
    const p = loadProgress()
    expect(p.countries).toEqual({})
    expect(p.recentErrors).toEqual([])
  })

  it('returns previously saved data', () => {
    const saved = { countries: { 1: { seen: 3, correct: 2 } }, recentErrors: [5] }
    localStorage.setItem('mapa-europa-progress', JSON.stringify(saved))
    const p = loadProgress()
    expect(p.countries[1]).toEqual({ seen: 3, correct: 2 })
    expect(p.recentErrors).toEqual([5])
  })

  it('returns empty progress on corrupt storage', () => {
    localStorage.setItem('mapa-europa-progress', 'not-json')
    const p = loadProgress()
    expect(p.countries).toEqual({})
  })
})

describe('saveProgress / loadProgress roundtrip', () => {
  it('persists and restores progress', () => {
    const initial = loadProgress()
    const updated = recordAnswers(initial, [
      { countryId: 1, correct: true },
      { countryId: 2, correct: false },
    ])
    saveProgress(updated)
    const loaded = loadProgress()
    expect(loaded.countries[1]).toEqual({ seen: 1, correct: 1 })
    expect(loaded.countries[2]).toEqual({ seen: 1, correct: 0 })
    expect(loaded.recentErrors).toContain(2)
    expect(loaded.recentErrors).not.toContain(1)
  })
})

describe('recordAnswers', () => {
  it('accumulates seen and correct counts', () => {
    const p = { countries: { 1: { seen: 2, correct: 1 } }, recentErrors: [] }
    const updated = recordAnswers(p, [{ countryId: 1, correct: true }])
    expect(updated.countries[1]).toEqual({ seen: 3, correct: 2 })
  })

  it('initializes stats for unseen country', () => {
    const p = { countries: {}, recentErrors: [] }
    const updated = recordAnswers(p, [{ countryId: 7, correct: false }])
    expect(updated.countries[7]).toEqual({ seen: 1, correct: 0 })
  })

  it('records incorrect IDs in recentErrors', () => {
    const p = { countries: {}, recentErrors: [] }
    const updated = recordAnswers(p, [
      { countryId: 3, correct: false },
      { countryId: 7, correct: true },
    ])
    expect(updated.recentErrors).toContain(3)
    expect(updated.recentErrors).not.toContain(7)
  })

  it('replaces previous recentErrors with current session errors', () => {
    const p = { countries: {}, recentErrors: [99] }
    const updated = recordAnswers(p, [{ countryId: 5, correct: false }])
    expect(updated.recentErrors).toEqual([5])
    expect(updated.recentErrors).not.toContain(99)
  })
})

describe('accuracy', () => {
  it('returns 0 for undefined stats', () => {
    expect(accuracy(undefined)).toBe(0)
  })

  it('returns 0 for unseen country', () => {
    expect(accuracy({ seen: 0, correct: 0 })).toBe(0)
  })

  it('returns correct ratio', () => {
    expect(accuracy({ seen: 4, correct: 3 })).toBe(0.75)
  })

  it('returns 1.0 for perfect score', () => {
    expect(accuracy({ seen: 5, correct: 5 })).toBe(1)
  })
})
