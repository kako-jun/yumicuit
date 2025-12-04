import { useState, useRef } from 'react'
import styles from './DreamQuestionnaire.module.css'

interface Question {
  id: string
  text: string
  options: string[]
}

const QUESTIONS: Question[] = [
  {
    id: 'place',
    text: 'どこにいた？',
    options: ['家', '学校', '職場', '外', '知らない場所', '空', '海', '山'],
  },
  {
    id: 'people',
    text: '誰がいた？',
    options: ['自分だけ', '家族', '友人', '恋人', '知らない人', '有名人', '動物'],
  },
  {
    id: 'action',
    text: '何をしていた？',
    options: ['歩く', '走る', '飛ぶ', '話す', '見てる', '逃げる', '探す', '食べる'],
  },
  {
    id: 'feeling',
    text: 'どんな気分だった？',
    options: ['楽しい', '怖い', '悲しい', '不思議', '懐かしい', '焦る', '安心'],
  },
  {
    id: 'object',
    text: '印象的だったものは？',
    options: ['乗り物', '食べ物', '水', '火', '光', '闇', '鏡', '扉'],
  },
]

interface DreamQuestionnaireProps {
  onComplete: (answers: Record<string, string[]>) => void
  onCancel: () => void
  initialAnswers?: Record<string, string[]>
}

export function DreamQuestionnaire({ onComplete, onCancel, initialAnswers = {} }: DreamQuestionnaireProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>(initialAnswers)
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const longPressTimer = useRef<number | null>(null)

  const currentQuestion = QUESTIONS[currentIndex]
  const isLastQuestion = currentIndex === QUESTIONS.length - 1
  const currentAnswers = answers[currentQuestion.id] || []

  const goNext = () => {
    if (isLastQuestion) {
      onComplete(answers)
    } else {
      setCurrentIndex(prev => prev + 1)
      setMultiSelectMode(false)
    }
  }

  const handleSelect = (option: string) => {
    if (multiSelectMode) {
      // 複数選択モード：トグル
      setAnswers(prev => {
        const current = prev[currentQuestion.id] || []
        if (current.includes(option)) {
          return { ...prev, [currentQuestion.id]: current.filter(o => o !== option) }
        }
        return { ...prev, [currentQuestion.id]: [...current, option] }
      })
    } else {
      // 通常モード：選んで次へ
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: [option],
      }))
      goNext()
    }
  }

  const handleTouchStart = () => {
    longPressTimer.current = window.setTimeout(() => {
      setMultiSelectMode(true)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setMultiSelectMode(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={i === currentIndex ? styles.active : i < currentIndex ? styles.done : ''}
          >
            ·
          </span>
        ))}
      </div>

      <h2 className={styles.question}>{currentQuestion.text}</h2>

      {multiSelectMode && (
        <p className={styles.multiHint}>複数選択中（完了したらタップ）</p>
      )}

      <div
        className={styles.options}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {currentQuestion.options.map(option => (
          <button
            key={option}
            className={`${styles.option} ${currentAnswers.includes(option) ? styles.selected : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.textButton} onClick={onCancel}>
          やめる
        </button>
        {currentIndex > 0 && (
          <button className={styles.textButton} onClick={handleBack}>
            戻る
          </button>
        )}
        <button className={styles.textButton} onClick={goNext}>
          {currentAnswers.length === 0 ? 'スキップ' : multiSelectMode ? '次へ' : ''}
        </button>
      </div>
    </div>
  )
}
