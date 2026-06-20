import { useState, useRef, useEffect } from 'react'

export default function TopBar({ treeName, shareUrl, onRename, onBack }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef(null)

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      timeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  async function handleNameBlur(e) {
    const val = e.target.value.trim()
    if (val && val !== treeName) await onRename(val)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: 44, background: 'white',
      borderBottom: '0.5px solid #e5e5e3', flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ border: 'none', background: 'none', color: '#6b7280', padding: '0 2px', fontSize: 16 }}
          >
            ←
          </button>
        )}
        <input
          key={treeName}
          defaultValue={treeName}
          onBlur={handleNameBlur}
          style={{ border: 'none', background: 'transparent', fontSize: 14, fontWeight: 500, width: 220, padding: 0 }}
        />
      </div>
      {shareUrl && (
        <button onClick={handleShare} style={{ fontSize: 12 }}>
          {copied ? '✓ Copied' : 'Share'}
        </button>
      )}
    </div>
  )
}
