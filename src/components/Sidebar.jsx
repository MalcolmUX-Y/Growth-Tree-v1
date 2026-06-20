import { useState } from 'react'

const STATES = [
  { value: 'bud', label: 'Bud', color: '#16a34a' },
  { value: 'leaf', label: 'Leaf', color: '#3d6b17' },
  { value: 'berry', label: 'Berry', color: '#7c3aed' },
  { value: 'harvested_berry', label: 'Harvest', color: '#c2612b' }
]

export default function Sidebar({ node, onUpdate, onAddBranch, onDelete, HomeContent }) {
  const [branchLabel, setBranchLabel] = useState('')
  const [adding, setAdding] = useState(false)

  if (!node) {
    return (
      <div style={{ padding: 14, height: '100%', overflowY: 'auto', borderLeft: '0.5px solid #e5e5e3' }}>
        {HomeContent}
      </div>
    )
  }

  const isRoot = node.parent_id === null

  async function handleLabelBlur(e) {
    const val = e.target.value.trim()
    if (val && val !== node.label) await onUpdate(node.id, { label: val })
  }

  async function handleDetailBlur(e) {
    const val = e.target.value
    if (val !== (node.detail ?? '')) await onUpdate(node.id, { detail: val || null })
  }

  async function handleAddBranch(e) {
    e.preventDefault()
    const label = branchLabel.trim()
    if (!label) return
    setAdding(true)
    await onAddBranch(node.id, label)
    setBranchLabel('')
    setAdding(false)
  }

  return (
    <div style={{
      padding: 14, height: '100%', overflowY: 'auto',
      borderLeft: '0.5px solid #e5e5e3',
      display: 'flex', flexDirection: 'column', gap: 12
    }}>
      <p style={{ fontSize: 10, color: '#9ca3af' }}>Selected branch</p>

      <div>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 3 }}>Label</label>
        <input key={node.id} defaultValue={node.label} onBlur={handleLabelBlur} />
      </div>

      {!isRoot && (
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 6 }}>State</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {STATES.map(opt => (
              <button
                key={opt.value}
                onClick={() => onUpdate(node.id, { state: opt.value })}
                style={{
                  padding: '5px 7px', fontSize: 11,
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: node.state === opt.value ? '#f5f5f3' : 'white',
                  borderColor: node.state === opt.value ? '#9ca3af' : '#e5e5e3',
                  fontWeight: node.state === opt.value ? '500' : '400'
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: opt.color, display: 'inline-block', flexShrink: 0
                }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr />

      <form onSubmit={handleAddBranch} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 11, color: '#6b7280' }}>Add branch</label>
        <input
          placeholder="Branch name"
          value={branchLabel}
          onChange={e => setBranchLabel(e.target.value)}
        />
        <button type="submit" disabled={adding || !branchLabel.trim()}>
          {adding ? 'Adding...' : '+ Add branch'}
        </button>
      </form>

      <div style={{ flex: 1 }}>
        <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 3 }}>Detail</label>
        <textarea
          key={node.id}
          defaultValue={node.detail ?? ''}
          onBlur={handleDetailBlur}
          placeholder="Notes (shown on select)..."
          style={{ height: 72, resize: 'none', fontSize: 12 }}
        />
      </div>

      {!isRoot && (
        <>
          <hr />
          <button
            onClick={() => onDelete(node.id)}
            style={{ color: '#dc2626', background: 'none', border: 'none', padding: '4px 0', fontSize: 12, justifyContent: 'flex-start' }}
          >
            Delete branch
          </button>
        </>
      )}
    </div>
  )
}
