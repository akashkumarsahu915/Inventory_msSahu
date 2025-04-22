import { createContext, useState, useContext, useEffect } from 'react'
import { mockProducts } from '../data/mockData'

const InventoryContext = createContext()

export const useInventory = () => useContext(InventoryContext)

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load mock data on initial render
  useEffect(() => {
    try {
      // In a real application, this would be an API call
      setProducts(mockProducts)
      setLoading(false)
    } catch (err) {
      setError('Failed to load inventory data')
      setLoading(false)
    }
  }, [])

  // Add a new product
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setProducts(prevProducts => [...prevProducts, newProduct])
    return newProduct
  }

  // Update an existing product
  const updateProduct = (id, updates) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
      )
    )
  }

  // Delete a product
  const deleteProduct = (id) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id))
  }

  // Update stock quantity
  const updateStock = (id, quantity, type = 'decrease') => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === id) {
          const newQuantity = type === 'decrease' 
            ? Math.max(0, product.quantity - quantity)
            : product.quantity + quantity
          
          return {
            ...product,
            quantity: newQuantity,
            updatedAt: new Date().toISOString()
          }
        }
        return product
      })
    )
  }

  // Get low stock products
  const getLowStockProducts = (threshold = 10) => {
    return products.filter(product => product.quantity <= threshold)
  }

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category)
  }

  // Search products
  const searchProducts = (query) => {
    if (!query) return products
    
    const searchTerm = query.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    )
  }

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts,
    getProductsByCategory,
    searchProducts
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}