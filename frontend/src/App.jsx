import { Routes, Route } from 'react-router-dom'
import { InventoryProvider } from './contexts/InventoryContext'
import { SalesProvider } from './contexts/SalesContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Reports from './pages/Reports'
import ProductDetail from './pages/ProductDetail'
import NewSale from './pages/NewSale'
import NotFound from './pages/NotFound'

function App() {
  return (
    <InventoryProvider>
      <SalesProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<ProductDetail />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/new" element={<NewSale />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </SalesProvider>
    </InventoryProvider>
  )
}

export default App