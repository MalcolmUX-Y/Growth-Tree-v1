import { useMemo } from 'react'
import { layoutTree } from '../lib/treeLayout.js'
import NodeIcon, { branchColor } from './NodeIcon.jsx'

const RESOLVED = new Set(['leaf', 'berry'])

export default function Canvas({ nodes, selectedNodeId, onSelectNode }) {
  const { positions, paths } = useMemo(() => layoutTree(nodes), [nodes])

  const nodeById = useMemo(
    () => Object.fromEntries((nodes ?? []).map(n => [n.id, n])),
    [nodes]
  )

  if (!nodes || nodes.length === 0) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 700 500">
        <text x={350} y={260} textAnchor="middle" fontSize={13} fill="#9ca3af" fontFamily="system-ui">
          Select a tree or create one to get started
        </text>
      </svg>
    )
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 700 500" preserveAspectRatio="xMidYMid meet">
      {paths.map(({ nodeId, growthPhase, d }) => {
        const node = nodeById[nodeId]
        const resolved = node && RESOLVED.has(node.state)
        return (
          <path
            key={nodeId}
            d={d}
            stroke={branchColor(growthPhase)}
            strokeWidth={growthPhase === 0 ? 3 : 2.5}
            fill="none"
            strokeLinecap="round"
            opacity={resolved ? 0.55 : 1}
          />
        )
      })}

      {nodes.map(node => {
        const pos = positions[node.id]
        if (!pos) return null
        const isSelected = node.id === selectedNodeId
        const resolved = RESOLVED.has(node.state)
        return (
          <g
            key={node.id}
            transform={`translate(${pos.x},${pos.y})`}
            onClick={() => onSelectNode?.(isSelected ? null : node.id)}
            style={{ cursor: 'pointer' }}
            opacity={resolved ? 0.7 : 1}
          >
            {isSelected && (
              <circle r={16} fill="none" stroke="#16a34a" strokeWidth={1.5} strokeDasharray="3,2" opacity={0.55} />
            )}
            <NodeIcon state={node.state} />
            <text
              y={26}
              textAnchor="middle"
              fontSize={11}
              fontFamily="system-ui, sans-serif"
              fill={isSelected ? '#111827' : '#78716c'}
              fontWeight={isSelected ? '500' : '400'}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
