import { useState, useRef, useEffect } from 'react'
import type { Question, SessionMode, SessionResult } from '../lib/session.ts'
import { isCorrectAnswer } from '../lib/normalize.ts'

interface QuizScreenProps {
  mode: SessionMode
  questions: Question[]
  onFinish: (results: SessionResult[]) => void
  onBack: () => void
}

const MODE_LABEL: Record<SessionMode, string> = {
  'country-to-capital': 'País → Capital',
  'capital-to-country': 'Capital → País',
  'mixed':              'Sesión Mixta',
  'review':             'Repaso de Errores',
  'country-to-map':     'País → Mapa',
}

export function QuizScreen({ mode, questions, onFinish, onBack }: QuizScreenProps) {
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [results, setResults] = useState<SessionResult[]>([])

  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const question = questions[index]
  const total = questions.length

  useEffect(() => {
    if (feedback) {
      nextBtnRef.current?.focus()
    } else if (question.type === 'country-to-capital') {
      inputRef.current?.focus()
    }
  }, [feedback, index, question.type])

  function submit(given: string, correct: boolean) {
    setResults(prev => [
      ...prev,
      { countryId: question.country.id, questionType: question.type, correct, given },
    ])
    setFeedback(correct ? 'correct' : 'incorrect')
  }

  function handleTextSubmit() {
    if (!input.trim() || feedback) return
    submit(input.trim(), isCorrectAnswer(question.country.capital, input.trim()))
  }

  function handleOptionSelect(option: string) {
    if (feedback) return
    setSelected(option)
    submit(option, option === question.country.name)
  }

  function handleNext() {
    if (index + 1 === total) {
      // 'results' is from the current render, which already includes the last answer
      // (submit updated it before this button became visible)
      onFinish(results)
    } else {
      setIndex(i => i + 1)
      setInput('')
      setSelected(null)
      setFeedback(null)
    }
  }

  return (
    <div className="screen">
      <div className="quiz-topbar">
        <button className="btn-back" onClick={onBack} aria-label="Volver al menú">
          ← Menú
        </button>
        <p className="meta">{MODE_LABEL[mode]} · Pregunta {index + 1} de {total}</p>
      </div>

      <div className="progress-bar">
        <div
          className="progress-bar__fill"
          style={{ width: `${((index + 1) / total) * 100}%` }}
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>

      {question.type === 'country-to-capital' ? (
        <>
          <h2>
            ¿Cuál es la capital de <strong>{question.country.name}</strong>?
          </h2>
          <input
            ref={inputRef}
            className="text-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') feedback ? handleNext() : handleTextSubmit()
            }}
            disabled={!!feedback}
            placeholder="Escribe la capital…"
            aria-label={`Capital de ${question.country.name}`}
            autoComplete="off"
          />
          {!feedback && (
            <button
              className="btn btn--primary"
              onClick={handleTextSubmit}
              disabled={!input.trim()}
            >
              Comprobar
            </button>
          )}
        </>
      ) : (
        <>
          <h2>
            ¿En qué país está <strong>{question.country.capital}</strong>?
          </h2>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {question.options.map(option => {
              const isCorrectOpt = option === question.country.name
              let cls = 'btn'
              if (feedback) {
                if (selected === option) cls += isCorrectOpt ? ' btn--correct' : ' btn--incorrect'
                else if (isCorrectOpt)  cls += ' btn--revealed'
              }
              return (
                <button
                  key={option}
                  className={cls}
                  onClick={() => handleOptionSelect(option)}
                  aria-pressed={selected === option ? true : undefined}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </>
      )}

      {feedback && (
        <>
          <div className={`feedback feedback--${feedback}`} role="status">
            {feedback === 'correct'
              ? '✓ ¡Correcto!'
              : `✗ La respuesta correcta es: ${
                  question.type === 'country-to-capital'
                    ? question.country.capital
                    : question.country.name
                }`}
          </div>
          <button ref={nextBtnRef} className="btn btn--primary" onClick={handleNext}>
            {index + 1 === total ? 'Ver resultado' : 'Siguiente →'}
          </button>
        </>
      )}
    </div>
  )
}
