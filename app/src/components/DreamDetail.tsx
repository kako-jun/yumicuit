import { useState } from 'react'
import type { DreamRecord } from '../types/dream'
import { interpretDream } from '../lib/llm'
import styles from './DreamDetail.module.css'

interface DreamDetailProps {
  dream: DreamRecord
  onClose: () => void
}

export function DreamDetail({ dream, onClose }: DreamDetailProps) {
  const [interpretation, setInterpretation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const date = new Date(dream.createdAt)
  const dateStr = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
  const timeStr = date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const fullText = dream.tokens.join('\n')

  const handleInterpret = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await interpretDream(fullText)
      setInterpretation(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.date}>{dateStr} {timeStr}</span>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {dream.tokens.map((token, i) => (
            <p key={i} className={styles.token}>{token}</p>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.interpretButton}
            onClick={handleInterpret}
            disabled={loading}
          >
            {loading ? '解釈中...' : 'AIに解釈してもらう'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {interpretation && (
          <div className={styles.interpretation}>
            <h3 className={styles.interpretationTitle}>AIの解釈</h3>
            <p>{interpretation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
