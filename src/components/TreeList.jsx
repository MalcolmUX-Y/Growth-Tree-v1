import { useState } from 'react'

export default function TreeList({ trees = [], loading, onSelect, onCreate, onDelete }) {
  const [name, setName] = useState('')
  const [rootLabel, setRootLabel] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim() || !rootLabel.trim()) return
    setCreating(true)
    await onCreate(name.trim(), rootLabel.trim())
    setName('')
    setRootLabel('')
    setCreating(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 10, color: '#9ca3af' }}>Your trees</p>

      {loading && <p style={{ fontSize: 12, color: '#9ca3af' }}>Loading...</p>}
      {!loading && trees.length === 0 && (
        <p style={{ fontSize: 12, color: '#9ca3af' }}>No trees yet.</p>
      )}
      {trees.map(t => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => onSelect(t.id)}
            style={{ justifyContent: 'flex-start', textAlign: 'left', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {t.name}
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(t.id)}
              title="Delete tree"
              style={{ flexShrink: 0, padding: '4px 6px', fontSize: 11, color: '#9ca3af', border: '0.5px solid transparent', background: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'transparent' }}
            >
              ×
            </button>
          )}
        </div>
      ))}

      <hr />

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <p style={{ fontSize: 10, color: '#9ca3af' }}>New tree</p>
        <input placeholder="Tree name" value={name} onChange={e => setName(e.target.value)} />
        <input
          placeholder="Root label (e.g. Company)"
          value={rootLabel}
          onChange={e => setRootLabel(e.target.value)}
        />
        <button type="submit" disabled={creating || !name.trim() || !rootLabel.trim()}>
          {creating ? 'Creating...' : '+ Create tree'}
        </button>
      </form>
    </div>
  )
}
