import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios';
const InventoryContext = createContext()
export const useInventory = () => useContext(InventoryContext)

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load mock data on initial render
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://mssahu-inventory-backend.onrender.com/admin/getAllSellProduct", {
  withCredentials: true
});

        setProducts(response.data.products);
        console.log(response.data)
      } catch (error) {
        setError("failed to load inventory data");
        console.log(error)
      } finally {
        setLoading(false)
      }

    }
    fetchProducts();
  }, [])

  // Add a new product
  const addProduct = (product) => {
    let response = axios.post("https://mssahu-inventory-backend.onrender.com/admin/inventory/new", product);
    console.log(response);
  }

  // Update an existing product
  const updateProduct = (id, updates) => {
    let responce = axios.put(`https://mssahu-inventory-backend.onrender.com/admin/updateProduct/${id}`, updates);
    console.log(responce);
  }



  // Delete a product
  const deleteProduct = (id) => {
    let response = axios.delete(`https://mssahu-inventory-backend.onrender.com/admin/deleteProduct/${id}`);
    console.log(response);
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
