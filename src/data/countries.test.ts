import { describe, it, expect } from 'vitest'
import { COUNTRIES } from './countries.ts'

describe('countries dataset', () => {
  it('has exactly 50 entries', () => {
    expect(COUNTRIES).toHaveLength(50)
  })

  it('has no duplicate names', () => {
    const names = COUNTRIES.map(c => c.name)
    expect(new Set(names).size).toBe(50)
  })

  it('has no duplicate ISO codes', () => {
    const isos = COUNTRIES.map(c => c.iso)
    expect(new Set(isos).size).toBe(50)
  })

  it('has no duplicate IDs', () => {
    const ids = COUNTRIES.map(c => c.id)
    expect(new Set(ids).size).toBe(50)
  })

  it('IDs are sequential 1–50', () => {
    const sorted = COUNTRIES.map(c => c.id).sort((a, b) => a - b)
    sorted.forEach((id, i) => expect(id).toBe(i + 1))
  })

  it('ISO codes are 2 uppercase letters', () => {
    COUNTRIES.forEach(c => expect(c.iso).toMatch(/^[A-Z]{2}$/))
  })

  it('no name or capital is empty', () => {
    COUNTRIES.forEach(c => {
      expect(c.name.trim()).not.toBe('')
      expect(c.capital.trim()).not.toBe('')
    })
  })

  it('names and capitals contain no asterisk or parentheses', () => {
    COUNTRIES.forEach(c => {
      expect(c.name).not.toContain('*')
      expect(c.name).not.toContain('(')
      expect(c.capital).not.toContain('*')
    })
  })

  it('marks exactly 7 countries with asterisk', () => {
    expect(COUNTRIES.filter(c => c.asterisk)).toHaveLength(7)
  })

  it('asterisk countries are the expected 7', () => {
    const asterisked = COUNTRIES.filter(c => c.asterisk).map(c => c.name).sort()
    expect(asterisked).toEqual(
      ['Armenia', 'Azerbaiyán', 'Chipre', 'Georgia', 'Kazajistán', 'Rusia', 'Turquía'].sort(),
    )
  })

  it('capitals are unique within the 50 records', () => {
    // Mónaco and Luxemburgo share country/capital name – those ARE distinct pairs
    const pairs = COUNTRIES.map(c => `${c.name}|${c.capital}`)
    expect(new Set(pairs).size).toBe(50)
  })
})
