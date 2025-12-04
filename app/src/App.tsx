import { useState, useCallback } from 'react'
import { DreamInput } from './components/DreamInput'
import { useAutoSave } from './hooks/useAutoSave'

function App() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSaved = useCallback(() => {
    setSaved(true)
    // Hide indicator after 2 seconds
    setTimeout(() => setSaved(false), 2000)
  }, [])

  useAutoSave({ text, onSaved: handleSaved })

  return (
    <>
      <DreamInput value={text} onChange={setText} />
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
