import type { SessionResult } from '../lib/session.ts'
import { COUNTRIES } from '../data/countries.ts'

interface ResultScreenProps {
  results: SessionResult[]
  onBack: () => void
}

export function ResultScreen({ results, onBack }: ResultScreenProps) {
  const correct = results.filter(r => r.correct).length
  const total = results.length
  const wrong = results.filter(r => !r.correct)

  return (
    <div className="screen">
      <h1>Sesión completada</h1>
      <p className="score">{correct} / {total}</p>

      {wrong.length === 0 ? (
        <p style={{ textAlign: 'center' }}>¡Perfecto! Todas correctas.</p>
      ) : (
        <>
          <h2 style={{ alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
            Respuestas incorrectas
          </h2>
          {wrong.map(r => {
            const country = COUNTRIES.find(c => c.id === r.countryId)!
            const isMap = r.questionType === 'country-to-map'
            const isCapQ = r.questionType === 'country-to-capital'
            return (
              <div key={`${r.countryId}-${r.questionType}`} className="result-item">
                <span className="result-item__label">
                  {isMap
                    ? `🗺 ¿Dónde está ${country.name}?`
                    : isCapQ
                      ? `¿Capital de ${country.name}?`
                      : `¿País de ${country.capital}?`}
                </span>
                <span className="result-item__given">
                  Tu respuesta: {r.given || '(sin respuesta)'}
                </span>
                {!isMap && (
                  <span className="result-item__correct">
                    Correcto: {isCapQ ? country.capital : country.name}
                  </span>
                )}
              </div>
            )
          })}
        </>
      )}

      <div className="spacer" />
      <button className="btn btn--primary" style={{ marginTop: '1rem' }} onClick={onBack}>
        Volver al inicio
      </button>
    </div>
  )
}
