import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useTree(treeId) {
  const [tree, setTree] = useState(null)
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!treeId) { setLoading(false); return }
    let cancelled = false
    async function load() {
      setError(null)
      setLoading(true)
      const [{ data: treeData, error: tErr }, { data: nodesData, error: nErr }] = await Promise.all([
        supabase.from('trees').select('*').eq('id', treeId).single(),
        supabase.from('nodes').select('*').eq('tree_id', treeId).order('position')
      ])
      if (cancelled) return
      if (tErr || nErr) { setError(tErr || nErr); setLoading(false); return }
      setTree(treeData)
      setNodes(nodesData ?? [])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [treeId])

  const addNode = useCallback(async (parentId, label) => {
    const siblings = nodes.filter(n => n.parent_id === parentId)
    const parent = nodes.find(n => n.id === parentId) ?? null
    const growthPhase = parent?.state === 'harvested_berry'
      ? (parent.growth_phase ?? 0) + 1
      : (parent?.growth_phase ?? 0)
    const { data, error } = await supabase.from('nodes').insert({
      tree_id: treeId, parent_id: parentId, label,
      state: 'bud', growth_phase: growthPhase,
      position: siblings.length, detail: null
    }).select().single()
    if (!error) setNodes(prev => [...prev, data])
    return { data, error }
  }, [nodes, treeId])

  const updateNode = useCallback(async (nodeId, updates) => {
    const { data, error } = await supabase.from('nodes')
      .update(updates).eq('id', nodeId).select().single()
    if (!error) setNodes(prev => prev.map(n => n.id === nodeId ? data : n))
    return { data, error }
  }, [])

  const deleteNode = useCallback(async (nodeId) => {
    function descendants(id, seen = new Set()) {
      if (seen.has(id)) return []
      seen.add(id)
      return [id, ...nodes.filter(n => n.parent_id === id).flatMap(k => descendants(k.id, seen))]
    }
    const ids = descendants(nodeId)
    const { error } = await supabase.from('nodes').delete().in('id', ids)
    if (!error) setNodes(prev => prev.filter(n => !ids.includes(n.id)))
    return { error }
  }, [nodes])

  const updateTree = useCallback(async (updates) => {
    const { data, error } = await supabase.from('trees')
      .update(updates).eq('id', treeId).select().single()
    if (!error) setTree(data)
    return { data, error }
  }, [treeId])

  return { tree, nodes, loading, error, addNode, updateNode, deleteNode, updateTree }
}

export function useTrees() {
  const [trees, setTrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    supabase.from('trees').select('*').order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) { setError(err); setLoading(false); return }
        setTrees(data ?? [])
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const createTree = useCallback(async (name, rootLabel) => {
    const { data: treeData, error: treeErr } = await supabase.from('trees')
      .insert({ name, root_label: rootLabel }).select().single()
    if (treeErr || !treeData) return null
    const { error: nodeErr } = await supabase.from('nodes').insert({
      tree_id: treeData.id, parent_id: null,
      label: rootLabel, state: 'bud',
      growth_phase: 0, position: 0, detail: null
    })
    if (nodeErr) {
      await supabase.from('trees').delete().eq('id', treeData.id)
      return null
    }
    setTrees(prev => [treeData, ...prev])
    return treeData
  }, [])

  return { trees, loading, error, createTree }
}
