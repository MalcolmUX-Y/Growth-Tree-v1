export function layoutTree(nodes, canvasWidth = 700, canvasHeight = 500) {
  if (!nodes || nodes.length === 0) return { positions: {}, paths: [] }

  const root = nodes.find(n => n.parent_id === null)
  if (!root) return { positions: {}, paths: [] }

  const childrenOf = {}
  nodes.forEach(n => { childrenOf[n.id] = [] })
  nodes.forEach(n => {
    if (n.parent_id !== null) childrenOf[n.parent_id]?.push(n)
  })
  Object.values(childrenOf).forEach(arr => arr.sort((a, b) => a.position - b.position))

  function leafCount(id) {
    const kids = childrenOf[id] ?? []
    if (kids.length === 0) return 1
    return kids.reduce((sum, k) => sum + leafCount(k.id), 0)
  }

  function maxDepthFrom(id, d = 0) {
    const kids = childrenOf[id] ?? []
    if (kids.length === 0) return d
    return Math.max(...kids.map(k => maxDepthFrom(k.id, d + 1)))
  }
  const maxDepth = maxDepthFrom(root.id)

  const PADDING = 60
  const rowHeight = maxDepth > 0 ? (canvasHeight - 120) / maxDepth : 0
  const positions = {}

  function assign(nodeId, xStart, xEnd, depth) {
    positions[nodeId] = {
      x: (xStart + xEnd) / 2,
      y: canvasHeight - 60 - depth * rowHeight
    }
    const kids = childrenOf[nodeId] ?? []
    const total = leafCount(nodeId)
    let cursor = xStart
    kids.forEach(kid => {
      const share = leafCount(kid.id) / total
      assign(kid.id, cursor, cursor + share * (xEnd - xStart), depth + 1)
      cursor += share * (xEnd - xStart)
    })
  }

  assign(root.id, PADDING, canvasWidth - PADDING, 0)

  const paths = nodes
    .filter(n => n.parent_id !== null)
    .map(n => {
      const from = positions[n.parent_id]
      const to = positions[n.id]
      if (!from || !to) return null
      const midY = (from.y + to.y) / 2
      return {
        nodeId: n.id,
        parentId: n.parent_id,
        growthPhase: n.growth_phase,
        d: `M ${from.x} ${from.y} C ${from.x},${midY} ${to.x},${midY} ${to.x},${to.y}`
      }
    })
    .filter(Boolean)

  return { positions, paths }
}
