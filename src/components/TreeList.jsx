import { useState } from 'react'

export default function TreeList({ trees = [], loading, onSelect, onCreate }) {
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
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          {t.name}
        </button>
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
