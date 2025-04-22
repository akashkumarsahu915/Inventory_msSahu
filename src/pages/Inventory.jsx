import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useInventory } from '../contexts/InventoryContext'
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import styles from './Inventory.module.css'

const Inventory = () => {
  const location = useLocation()
  const { products, loading, deleteProduct, getProductsByCategory, searchProducts } = useInventory()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Get search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [location.search])
  
  // Apply filters when products, search query or category changes
  useEffect(() => {
    let result = [...products]
    
    // Filter by search query
    if (searchQuery) {
      result = searchProducts(searchQuery)
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory)
    }
    
    setFilteredProducts(result)
  }, [products, searchQuery, selectedCategory, searchProducts])
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }
  
  if (loading) {
    return <div className={styles.loading}>Loading inventory...</div>
  }
  
  return (
    <div className={styles.inventory}>
      <div className={styles.header}>
        <h1>Inventory Management</h1>
        <Link to="/inventory/new" className={`btn btn-primary ${styles.addButton}`}>
          <FaPlus /> Add Product
        </Link>
      </div>
      
      <div className={styles.filters}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInput}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <div className={styles.categoryFilter}>
          <div className={styles.filterIcon}>
            <FaFilter />
          </div>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">All Categories</option>
            <option value="seeds">Seeds</option>
            <option value="fertilizers">Fertilizers</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>
      </div>
      
      <div className={styles.productsGrid}>
        {filteredProducts.map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              <img src={product.imageUrl} alt={product.name} />
              <div className={styles.productCategory}>{product.category}</div>
              
              {product.quantity <= product.lowStockThreshold && (
                <div className={styles.lowStockBadge}>
                  Low Stock
                </div>
              )}
            </div>
            
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              
              <div className={styles.productMeta}>
                <div className={styles.price}>₹{product.price.toLocaleString()}</div>
                <div className={styles.stock}>
                  {product.quantity} {product.unit} available
                </div>
              </div>
              
              <div className={styles.productActions}>
                <Link 
                  to={`/inventory/${product.id}`} 
                  className={`btn btn-outline ${styles.editButton}`}
                >
                  <FaEdit /> Edit
                </Link>
                <button 
                  className={`btn btn-outline ${styles.deleteButton}`}
                  onClick={() => handleDelete(product.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters, or add a new product.</p>
            <Link to="/inventory/new" className="btn btn-primary">
              <FaPlus /> Add Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory