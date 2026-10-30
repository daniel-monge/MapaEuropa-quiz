import { useState } from 'react'
import { loadProgress, saveProgress, recordAnswers } from './lib/progress.ts'
import type { Progress } from './lib/progress.ts'
import { generateSession } from './lib/session.ts'
import type { Question, SessionMode, SessionResult } from './lib/session.ts'
import { HomeScreen } from './screens/HomeScreen.tsx'
import { QuizScreen } from './screens/QuizScreen.tsx'
import { MapScreen } from './screens/MapScreen.tsx'
import { ResultScreen } from './screens/ResultScreen.tsx'

type Screen = 'home' | 'quiz' | 'result'

export default function App() {
  const [screen, setScreen]       = useState<Screen>('home')
  const [mode, setMode]           = useState<SessionMode>('country-to-capital')
  const [questions, setQuestions] = useState<Question[]>([])
  const [results, setResults]     = useState<SessionResult[]>([])
  const [progress, setProgress]   = useState<Progress>(loadProgress)

  function handleStart(m: SessionMode) {
    setMode(m)
    setQuestions(generateSession(m, progress))
    setResults([])
    setScreen('quiz')
  }

  function handleFinish(rs: SessionResult[]) {
    const updated = recordAnswers(progress, rs)
    saveProgress(updated)
    setProgress(updated)
    setResults(rs)
    setScreen('result')
  }

  if (screen === 'quiz') {
    if (mode === 'country-to-map') {
      return <MapScreen questions={questions} onFinish={handleFinish} onBack={() => setScreen('home')} />
    }
    return (
      <QuizScreen
        mode={mode}
        questions={questions}
        onFinish={handleFinish}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        results={results}
        onBack={() => setScreen('home')}
      />
    )
  }

  return <HomeScreen progress={progress} onStart={handleStart} />
}
