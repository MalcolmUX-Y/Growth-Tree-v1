import { describe, it, expect } from 'vitest'
import { layoutTree } from './treeLayout.js'

const n = (id, parent_id, position = 0, growth_phase = 0) => ({
  id, parent_id, label: id, state: 'bud', growth_phase, position
})

describe('layoutTree', () => {
  it('returns empty result for no nodes', () => {
    const { positions, paths } = layoutTree([])
    expect(positions).toEqual({})
    expect(paths).toEqual([])
  })

  it('positions root near bottom center', () => {
    const { positions } = layoutTree([n('root', null)], 700, 500)
    expect(positions['root'].x).toBeCloseTo(350, 0)
    expect(positions['root'].y).toBeGreaterThan(400)
  })

  it('positions child higher than parent', () => {
    const nodes = [n('root', null), n('child', 'root')]
    const { positions } = layoutTree(nodes, 700, 500)
    expect(positions['child'].y).toBeLessThan(positions['root'].y)
  })

  it('two children spread symmetrically around root', () => {
    const nodes = [n('root', null), n('l', 'root', 0), n('r', 'root', 1)]
    const { positions } = layoutTree(nodes, 700, 500)
    const rootX = positions['root'].x
    const lDiff = rootX - positions['l'].x
    const rDiff = positions['r'].x - rootX
    expect(lDiff).toBeGreaterThan(0)
    expect(rDiff).toBeGreaterThan(0)
    expect(Math.abs(lDiff - rDiff)).toBeLessThan(1)
  })

  it('generates one bezier path per non-root node', () => {
    const nodes = [n('root', null), n('a', 'root'), n('b', 'root', 1)]
    const { paths } = layoutTree(nodes, 700, 500)
    expect(paths).toHaveLength(2)
    paths.forEach(p => expect(p.d).toMatch(/^M [\d.]+ [\d.]+ C /))
  })

  it('path carries growthPhase from the child node', () => {
    const nodes = [n('root', null), n('child', 'root', 0, 1)]
    const { paths } = layoutTree(nodes, 700, 500)
    expect(paths[0].growthPhase).toBe(1)
  })

  it('bezier path matches spec format with correct control points', () => {
    const nodes = [n('root', null), n('child', 'root')]
    const { positions, paths } = layoutTree(nodes, 700, 500)
    const { x: px, y: py } = positions['root']
    const { x: cx, y: cy } = positions['child']
    const midY = (py + cy) / 2
    expect(paths[0].d).toBe(`M ${px} ${py} C ${px},${midY} ${cx},${midY} ${cx},${cy}`)
  })
})
