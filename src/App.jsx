import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import TreeView from './pages/TreeView.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/t/:id" element={<TreeView />} />
      </Routes>
    </HashRouter>
  )
}
