import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const InventoryContext = createContext()
export const useInventory = () => useContext(InventoryContext)

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://mssahu-inventory-backend.onrender.com/admin/getAllProduct", {
        withCredentials: true
      })

      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products)
      } else {
        setProducts([])
      }

      console.log('Fetched products:', response.data.products)
    } catch (error) {
      console.error("Fetch Error:", error)
      setError("Failed to load inventory data")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Add a new product and refresh inventory
  const addProduct = async (product) => {
    try {
      await axios.post("https://mssahu-inventory-backend.onrender.com/admin/inventory/new", product)
      await fetchProducts()
    } catch (error) {
      console.error("Add Product Error:", error)
    }
  }

  // Update a product
  const updateProduct = async (id, updates) => {
    try {
      await axios.put(`https://mssahu-inventory-backend.onrender.com/admin/updateProduct/${id}`, updates)
      await fetchProducts()
    } catch (error) {
      console.error("Update Product Error:", error)
    }
  }

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://mssahu-inventory-backend.onrender.com/admin/deleteProduct/${id}`)
      await fetchProducts()
    } catch (error) {
      console.error("Delete Product Error:", error)
    }
  }

  // Update stock quantity locally
  const updateStock = (id, quantity, type = 'decrease') => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product._id === id || product.id === id) {
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

  // Low stock filter
  const getLowStockProducts = (threshold = 10) => {
    if (!Array.isArray(products)) return []
    return products.filter(product => product.quantity <= threshold)
  }

  // Get products by category
  const getProductsByCategory = (category) => {
    if (!Array.isArray(products)) return []
    return products.filter(product => product.category === category)
  }

  // Search
  const searchProducts = (query) => {
    if (!query || !Array.isArray(products)) return products

    const term = query.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
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
    searchProducts,
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}
