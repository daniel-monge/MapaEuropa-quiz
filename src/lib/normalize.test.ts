import { describe, it, expect } from 'vitest'
import { normalize, isCorrectAnswer } from './normalize.ts'

describe('normalize', () => {
  it('lowercases', () => {
    expect(normalize('MADRID')).toBe('madrid')
  })

  it('strips diacritics', () => {
    expect(normalize('París')).toBe('paris')
    expect(normalize('Berlín')).toBe('berlin')
    expect(normalize('Ámsterdam')).toBe('amsterdam')
    expect(normalize('Tallín')).toBe('tallin')
    expect(normalize('Sofía')).toBe('sofia')
    expect(normalize('Dublín')).toBe('dublin')
    expect(normalize('Astaná')).toBe('astana')
    expect(normalize('Moscú')).toBe('moscu')
    expect(normalize('Rumanía')).toBe('rumania')
  })

  it('collapses whitespace', () => {
    expect(normalize('  Madrid  ')).toBe('madrid')
    expect(normalize('Andorra  La  Vieja')).toBe('andorra la vieja')
  })
})

describe('isCorrectAnswer', () => {
  it('accepts exact match', () => {
    expect(isCorrectAnswer('Madrid', 'Madrid')).toBe(true)
  })

  it('ignores case', () => {
    expect(isCorrectAnswer('Madrid', 'madrid')).toBe(true)
    expect(isCorrectAnswer('Madrid', 'MADRID')).toBe(true)
  })

  it('ignores diacritics', () => {
    expect(isCorrectAnswer('París', 'Paris')).toBe(true)
    expect(isCorrectAnswer('Berlín', 'Berlin')).toBe(true)
    expect(isCorrectAnswer('Ámsterdam', 'Amsterdam')).toBe(true)
    expect(isCorrectAnswer('Tallín', 'Tallin')).toBe(true)
    expect(isCorrectAnswer('Reikiavik', 'Reikiavik')).toBe(true)
    expect(isCorrectAnswer('Tiflis', 'Tiflis')).toBe(true)
  })

  it('ignores surrounding whitespace', () => {
    expect(isCorrectAnswer('Madrid', '  Madrid  ')).toBe(true)
  })

  it('rejects different capitals', () => {
    expect(isCorrectAnswer('Madrid', 'Lisboa')).toBe(false)
    expect(isCorrectAnswer('Madrid', 'Paris')).toBe(false)
    expect(isCorrectAnswer('Riga', 'Roma')).toBe(false)
    expect(isCorrectAnswer('Berna', 'Berlín')).toBe(false)
  })

  it('distinguishes capitals that look similar without diacritics', () => {
    expect(isCorrectAnswer('Vilna', 'vilna')).toBe(true)
    expect(isCorrectAnswer('Viena', 'viena')).toBe(true)
    expect(isCorrectAnswer('Viena', 'Varsovia')).toBe(false)
  })
})

describe('isCorrectAnswer – aliases aprobados', () => {
  it('acepta Tbilisi para Tiflis', () => {
    expect(isCorrectAnswer('Tiflis', 'Tbilisi')).toBe(true)
    expect(isCorrectAnswer('Tiflis', 'tbilisi')).toBe(true)
  })

  it('acepta Kyiv para Kiev', () => {
    expect(isCorrectAnswer('Kiev', 'Kyiv')).toBe(true)
    expect(isCorrectAnswer('Kiev', 'kyiv')).toBe(true)
  })

  it('acepta Vilnius para Vilna', () => {
    expect(isCorrectAnswer('Vilna', 'Vilnius')).toBe(true)
  })

  it('acepta Skopje para Skopie', () => {
    expect(isCorrectAnswer('Skopie', 'Skopje')).toBe(true)
  })

  it('acepta Andorra la Vella para Andorra La Vieja', () => {
    expect(isCorrectAnswer('Andorra La Vieja', 'Andorra la Vella')).toBe(true)
    expect(isCorrectAnswer('Andorra La Vieja', 'andorra la vella')).toBe(true)
  })

  it('acepta Astana y Nur-Sultan para Astaná', () => {
    expect(isCorrectAnswer('Astaná', 'Astana')).toBe(true)
    expect(isCorrectAnswer('Astaná', 'Nur-Sultan')).toBe(true)
  })

  it('acepta Chișinău para Chisinau', () => {
    expect(isCorrectAnswer('Chisinau', 'Chișinău')).toBe(true)
  })

  it('acepta Reykjavik para Reikiavik', () => {
    expect(isCorrectAnswer('Reikiavik', 'Reykjavik')).toBe(true)
  })

  it('no acepta un alias como respuesta para una capital diferente', () => {
    expect(isCorrectAnswer('Bakú', 'Tbilisi')).toBe(false)
    expect(isCorrectAnswer('Madrid', 'Kyiv')).toBe(false)
  })
})
