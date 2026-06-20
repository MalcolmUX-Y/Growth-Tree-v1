import React from 'react'
import NodeIcon from './NodeIcon.jsx'

const NODE_STATES = [
  { state: 'bud',              label: 'Bud',       desc: 'Active, open' },
  { state: 'leaf',             label: 'Leaf',      desc: 'Concluded' },
  { state: 'berry',            label: 'Berry',     desc: 'Dormant — revisitable' },
  { state: 'harvested_berry',  label: 'Harvested', desc: 'Revived — growth continues' },
]

const BRANCH_PHASES = [
  { color: '#6b5c4e', label: 'Original growth' },
  { color: '#0d9488', label: 'After first harvest' },
  { color: '#e879a0', label: 'After second harvest' },
]

function NodePreview({ state }) {
  return (
    <svg width={28} height={28} viewBox="-14 -14 28 28" style={{ flexShrink: 0 }}>
      <NodeIcon state={state} />
    </svg>
  )
}

function BranchPreview({ color }) {
  return (
    <svg width={20} height={28} viewBox="0 0 20 28" style={{ flexShrink: 0 }}>
      <path d="M 10,26 C 10,18 10,10 10,2" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function Legend() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 10, color: '#9ca3af' }}>Node states</p>
      {NODE_STATES.map(({ state, label, desc }) => (
        <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NodePreview state={state} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#374151', lineHeight: 1.2 }}>{label}</p>
            <p style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.3 }}>{desc}</p>
          </div>
        </div>
      ))}

      <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>Branch hues</p>
      {BRANCH_PHASES.map(({ color, label }) => (
        <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BranchPreview color={color} />
          <p style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.3 }}>{label}</p>
        </div>
      ))}
    </div>
  )
}
