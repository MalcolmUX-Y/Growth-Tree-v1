import { useMemo } from 'react'
import { layoutTree } from '../lib/treeLayout.js'
import NodeIcon, { branchColor } from './NodeIcon.jsx'

const RESOLVED = new Set(['leaf', 'berry'])
const ZOOM = 2.2

const STATE_LABEL = {
  bud: 'Bud',
  leaf: 'Leaf',
  berry: 'Berry',
  harvested_berry: 'Harvested berry',
}
const STATE_COLOR = {
  bud: '#16a34a',
  leaf: '#3d6b17',
  berry: '#7c3aed',
  harvested_berry: '#c2612b',
}

function splitLines(text, maxChars = 28) {
  if (!text) return []
  const words = text.split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    const joined = cur ? `${cur} ${w}` : w
    if (joined.length > maxChars && cur) {
      lines.push(cur)
      cur = w
      if (lines.length === 4) break
    } else {
      cur = joined
    }
  }
  if (cur && lines.length < 4) lines.push(cur)
  return lines
}

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

  const selectedNode = selectedNodeId ? nodeById[selectedNodeId] : null
  const selectedPos = selectedNodeId ? positions[selectedNodeId] : null

  const zoomTx = selectedPos ? 350 - selectedPos.x * ZOOM : 0
  const zoomTy = selectedPos ? 250 - selectedPos.y * ZOOM : 0

  const detailLines = splitLines(selectedNode?.detail ?? '')
  const lineOpacity = [1, 0.7, 0.45, 0.25]

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 700 500"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x={0} y={0} width={700} height={500}
        fill="transparent"
        onClick={() => onSelectNode?.(null)}
      />

      {/* Zoom layer */}
      <g style={{
        transform: selectedPos
          ? `translate(${zoomTx}px, ${zoomTy}px) scale(${ZOOM})`
          : 'translate(0px, 0px) scale(1)',
        transformOrigin: '0px 0px',
        transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
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
              onClick={e => { e.stopPropagation(); onSelectNode?.(isSelected ? null : node.id) }}
              style={{ cursor: 'pointer' }}
              opacity={resolved ? 0.7 : 1}
            >
              {isSelected && (
                <circle r={16} fill="none" stroke="#16a34a" strokeWidth={1.5} strokeDasharray="3,2" opacity={0.4} />
              )}
              <NodeIcon state={node.state} />
              {/* Hide label when zoomed — shown in overlay instead */}
              {!isSelected && (
                <text
                  y={26}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="system-ui, sans-serif"
                  fill="#78716c"
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}
      </g>

      {/* Overlay — information arranged around the zoomed node */}
      {selectedNode && (
        <g>
          {/* State name — upper right of icon, in quotes like the sketch */}
          <circle
            cx={392} cy={209}
            r={4.5}
            fill={STATE_COLOR[selectedNode.state] ?? '#6b7280'}
          />
          <text
            x={402} y={214}
            fontSize={14}
            fontFamily="system-ui, sans-serif"
            fill="#1f2937"
            fontWeight="500"
          >
            "{STATE_LABEL[selectedNode.state] ?? selectedNode.state}"
          </text>

          {/* Detail lines — to the right, fading */}
          {detailLines.map((line, i) => (
            <text
              key={i}
              x={392}
              y={236 + i * 20}
              fontSize={12 - i * 0.4}
              fontFamily="system-ui, sans-serif"
              fill="#6b7280"
              opacity={lineOpacity[i]}
            >
              {line}
            </text>
          ))}

          {/* No detail placeholder */}
          {detailLines.length === 0 && (
            <text
              x={392} y={236}
              fontSize={11}
              fontFamily="system-ui, sans-serif"
              fill="#d4d4d0"
              fontStyle="italic"
            >
              no detail added
            </text>
          )}

          {/* Node label — below the icon (ID line from sketch) */}
          <text
            x={350} y={308}
            textAnchor="middle"
            fontSize={11}
            fontFamily="system-ui, sans-serif"
            fill="#9ca3af"
            letterSpacing="0.5"
          >
            {selectedNode.label}
          </text>
        </g>
      )}
    </svg>
  )
}
