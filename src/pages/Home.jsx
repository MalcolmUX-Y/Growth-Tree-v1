import { useNavigate } from 'react-router-dom'
import { useTrees } from '../hooks/useTree.js'
import TreeList from '../components/TreeList.jsx'

export default function Home() {
  const navigate = useNavigate()
  const { trees, loading, createTree, deleteTree } = useTrees()

  async function handleCreate(name, rootLabel) {
    const tree = await createTree(name, rootLabel)
    if (tree) navigate(`/t/${tree.id}`)
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 24 }}>Growth Tree</h1>
      <TreeList
        trees={trees}
        loading={loading}
        onSelect={id => navigate(`/t/${id}`)}
        onCreate={handleCreate}
        onDelete={deleteTree}
      />
    </div>
  )
}
