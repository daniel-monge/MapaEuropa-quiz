import { useState } from 'react'
import type { Question, SessionResult } from '../lib/session.ts'
import { ISO_NUMERIC, numToName } from '../data/geoData.ts'
import { COUNTRIES } from '../data/countries.ts'
import { EuropeMap } from '../components/EuropeMap.tsx'

// Lista ordenada alfabéticamente para el selector accesible
const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, 'es'))

interface Props {
  questions: Question[]
  onFinish: (results: SessionResult[]) => void
  onBack: () => void
}

export function MapScreen({ questions, onFinish, onBack }: Props) {
  const [index,        setIndex]        = useState(0)
  const [feedback,     setFeedback]     = useState<'correct' | 'incorrect' | null>(null)
  const [clickedNumId, setClickedNumId] = useState<number | null>(null)
  const [clickedName,  setClickedName]  = useState('')
  const [results,      setResults]      = useState<SessionResult[]>([])

  const question = questions[index]
  const country  = question.country
  const targetNumId = ISO_NUMERIC[country.iso] ?? -1

  function handleCountryClick(numId: number, name: string) {
    if (feedback !== null) return   // ya contestó esta pregunta
    const correct = numId === targetNumId
    setClickedNumId(numId)
    setClickedName(name || numToName(numId))
    setFeedback(correct ? 'correct' : 'incorrect')
    setResults(prev => [...prev, {
      countryId:    country.id,
      questionType: 'country-to-map',
      correct,
      given: name || numToName(numId),
    }])
  }

  function handleNext() {
    const nextIndex = index + 1
    if (nextIndex >= questions.length) {
      onFinish([...results])
    } else {
      setIndex(nextIndex)
      setFeedback(null)
      setClickedNumId(null)
      setClickedName('')
    }
  }

  const total     = questions.length
  const pct       = Math.round((index / total) * 100)
  const isLast    = index + 1 === total

  return (
    <div className="map-screen">
      <div className="map-screen__header">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Pregunta ${index + 1} de ${total}`}
        >
          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="map-question-row">
          <button className="btn-back" onClick={onBack} aria-label="Volver al menú">
            ← Menú
          </button>
          <p className="map-question">
            ¿Dónde está <strong>{country.name}</strong>?
          </p>
          <span className="map-counter">{index + 1} / {total}</span>
        </div>

        {/* Selector accesible — alternativa al clic en el mapa */}
        {!feedback && (
          <label className="map-a11y-label">
            <span className="sr-only">Seleccionar país con teclado:</span>
            <select
              className="map-a11y-select"
              value=""
              onChange={e => {
                const iso = e.target.value
                if (!iso) return
                const numId = ISO_NUMERIC[iso]
                const c = COUNTRIES.find(c => c.iso === iso)
                if (c && numId !== undefined) handleCountryClick(numId, c.name)
              }}
            >
              <option value="">🌍 Buscar país…</option>
              {SORTED_COUNTRIES.map(c => (
                <option key={c.iso} value={c.iso}>{c.name}</option>
              ))}
            </select>
          </label>
        )}

        {feedback && (
          <div className={`feedback feedback--${feedback}`} role="status">
            {feedback === 'correct'
              ? '✓ ¡Correcto!'
              : `✗ Era ${country.name}${clickedName ? `. Seleccionaste: ${clickedName}` : ''}`
            }
            <button
              className="btn btn--primary map-next-btn"
              onClick={handleNext}
              autoFocus
            >
              {isLast ? 'Ver resultados' : 'Siguiente →'}
            </button>
          </div>
        )}
      </div>

      <div className="map-screen__map">
        <EuropeMap
          targetNumId={targetNumId}
          clickedNumId={clickedNumId}
          feedback={feedback}
          onCountryClick={handleCountryClick}
        />
      </div>
    </div>
  )
}
