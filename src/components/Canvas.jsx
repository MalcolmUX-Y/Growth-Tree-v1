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

  const detail = selectedNode?.detail ?? ''
  const detailLine = detail.length > 44 ? detail.slice(0, 44) + '…' : detail

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 700 500"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Transparent background to catch deselect clicks */}
      <rect
        x={0} y={0} width={700} height={500}
        fill="transparent"
        onClick={() => onSelectNode?.(null)}
      />

      {/* Zoom layer — scales and translates to center the selected node */}
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
      </g>

      {/* Overlay layer — floating callout, always at fixed screen position */}
      {selectedNode && (
        <g>
          {/* Dashed connector from node center (canvas center after zoom) to card */}
          <line
            x1={350} y1={246}
            x2={408} y2={196}
            stroke="#c9c5bc"
            strokeWidth={1}
            strokeDasharray="4,3"
          />
          <circle cx={350} cy={246} r={2.5} fill="#c9c5bc" />

          {/* Card background */}
          <rect
            x={408} y={166}
            width={182}
            height={detailLine ? 68 : 46}
            rx={9}
            fill="white"
            stroke="#e5e5e3"
            strokeWidth={0.75}
          />

          {/* State indicator + name */}
          <circle cx={423} cy={185} r={4.5} fill={STATE_COLOR[selectedNode.state] ?? '#6b7280'} />
          <text
            x={434} y={189}
            fontSize={12}
            fontFamily="system-ui, sans-serif"
            fill="#1f2937"
            fontWeight="500"
          >
            {STATE_LABEL[selectedNode.state] ?? selectedNode.state}
          </text>

          {/* Node label */}
          <text
            x={423} y={207}
            fontSize={11}
            fontFamily="system-ui, sans-serif"
            fill="#6b7280"
          >
            {selectedNode.label.length > 22
              ? selectedNode.label.slice(0, 22) + '…'
              : selectedNode.label}
          </text>

          {/* Detail text */}
          {detailLine && (
            <text
              x={423} y={224}
              fontSize={10.5}
              fontFamily="system-ui, sans-serif"
              fill="#9ca3af"
            >
              {detailLine}
            </text>
          )}
        </g>
      )}
    </svg>
  )
}
