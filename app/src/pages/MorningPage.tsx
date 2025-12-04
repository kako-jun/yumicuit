import { useState, useCallback, useRef } from 'react'
import { DreamInput } from '../components/DreamInput'
import { MicButton } from '../components/MicButton'
import { useAutoSave } from '../hooks/useAutoSave'

export function MorningPage() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSaved = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  useAutoSave({ text, onSaved: handleSaved })

  const handleMicClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'ja-JP'
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event: any) => {
          let transcript = ''
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setText(prev => prev + transcript)
        }

        recognition.start()
      }
    }
  }, [])

  return (
    <>
      <DreamInput ref={inputRef} value={text} onChange={setText} />
      <MicButton onClick={handleMicClick} />
      {saved && <SaveIndicator />}
    </>
  )
}

function SaveIndicator() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--spacing-lg) + 40px)',
      right: 'var(--spacing-lg)',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--font-size-small)',
    }}>
      saved
    </div>
  )
}
