import { useState, useCallback, useRef } from 'react'
import { DreamBackground } from './components/DreamBackground'
import { DreamInput } from './components/DreamInput'
import { Logo } from './components/Logo'
import { MicButton } from './components/MicButton'
import { useAutoSave } from './hooks/useAutoSave'

function App() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSaved = useCallback(() => {
    setSaved(true)
    // Hide indicator after 2 seconds
    setTimeout(() => setSaved(false), 2000)
  }, [])

  useAutoSave({ text, onSaved: handleSaved })

  const handleMicClick = useCallback(() => {
    // Focus the textarea to trigger Android keyboard with voice input option
    if (inputRef.current) {
      inputRef.current.focus()
      // On Android, this should show the keyboard which has a mic button
      // For Web Speech API fallback on desktop:
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
      <DreamBackground />
      <Logo />
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
      bottom: 'var(--spacing-lg)',
      right: 'var(--spacing-lg)',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--font-size-small)',
    }}>
      saved
    </div>
  )
}

export default App
