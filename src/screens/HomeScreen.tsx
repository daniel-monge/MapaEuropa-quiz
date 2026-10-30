import type { Progress } from '../lib/progress.ts'
import type { SessionMode } from '../lib/session.ts'

interface HomeScreenProps {
  progress: Progress
  onStart: (mode: SessionMode) => void
}

export function HomeScreen({ progress, onStart }: HomeScreenProps) {
  const hasErrors = progress.recentErrors.length > 0

  return (
    <div className="screen">
      <h1>Mapa Europa</h1>
      <p className="meta">50 países y capitales · 6.º Primaria</p>

      <div style={{ width: '100%', marginTop: '1rem' }}>
        <button className="btn btn--primary" onClick={() => onStart('country-to-capital')}>
          País → Capital
        </button>
        <button
          className="btn btn--primary"
          style={{ marginTop: '0.75rem' }}
          onClick={() => onStart('capital-to-country')}
        >
          Capital → País
        </button>
        <button
          className="btn btn--primary"
          style={{ marginTop: '0.75rem' }}
          onClick={() => onStart('mixed')}
        >
          Sesión Mixta
        </button>
        <button
          className="btn btn--primary"
          style={{ marginTop: '0.75rem' }}
          onClick={() => onStart('country-to-map')}
        >
          País → Mapa 🗺
        </button>
        <button
          className="btn"
          style={{ marginTop: '0.75rem' }}
          onClick={() => onStart('review')}
          disabled={!hasErrors}
        >
          {hasErrors
            ? `Repasar Errores (${progress.recentErrors.length})`
            : 'Repasar Errores'}
        </button>
      </div>
    </div>
  )
}
