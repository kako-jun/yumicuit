import { useRef, useEffect } from 'react'
import styles from './DreamInput.module.css'

interface DreamInputProps {
  value: string
  onChange: (value: string) => void
}

export function DreamInput({ value, onChange }: DreamInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Auto-focus on mount
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    // Auto-resize textarea
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
    />
  )
}
