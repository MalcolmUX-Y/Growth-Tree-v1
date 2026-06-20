import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTree, useTrees } from '../hooks/useTree.js'
import Canvas from '../components/Canvas.jsx'
import Sidebar from '../components/Sidebar.jsx'
import TopBar from '../components/TopBar.jsx'
import TreeList from '../components/TreeList.jsx'

export default function TreeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tree, nodes, loading, error, addNode, updateNode, deleteNode, updateTree } = useTree(id)
  const { trees, createTree, deleteTree } = useTrees()
  const [selectedId, setSelectedId] = useState(null)

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null
  const shareUrl = `${window.location.origin}${window.location.pathname}#/t/${id}`

  async function handleDelete(nodeId) {
    setSelectedId(null)
    await deleteNode(nodeId)
  }

  async function handleCreate(name, rootLabel) {
    const newTree = await createTree(name, rootLabel)
    if (newTree) navigate(`/t/${newTree.id}`)
  }

  if (loading) return <div style={{ padding: 20, color: '#9ca3af' }}>Loading...</div>
  if (error) return <div style={{ padding: 20, color: '#dc2626' }}>Error: {error.message}</div>
  if (!tree) return <div style={{ padding: 20, color: '#9ca3af' }}>Tree not found.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        treeName={tree.name}
        shareUrl={shareUrl}
        onRename={name => updateTree({ name })}
        onBack={() => navigate('/')}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 3, background: '#fafaf8', overflow: 'hidden' }}>
          <Canvas nodes={nodes} selectedNodeId={selectedId} onSelectNode={setSelectedId} />
        </div>
        <div style={{ flex: 1, minWidth: 160, maxWidth: 220, overflow: 'hidden' }}>
          <Sidebar
            node={selectedNode}
            onUpdate={updateNode}
            onAddBranch={addNode}
            onDelete={handleDelete}
            HomeContent={
              <TreeList
                trees={trees}
                loading={false}
                onSelect={tid => navigate(`/t/${tid}`)}
                onCreate={handleCreate}
                onDelete={async (tid) => {
                  await deleteTree(tid)
                  if (tid === id) navigate('/')
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}
