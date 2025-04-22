import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../contexts/InventoryContext'
import { useSales } from '../contexts/SalesContext'
import { FaPlus, FaMinus, FaTrash, FaSearch } from 'react-icons/fa'
import styles from './NewSale.module.css'

const NewSale = () => {
  const navigate = useNavigate()
  const { products, searchProducts } = useInventory()
  const { addSale } = useSales()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [customer, setCustomer] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.05 // 5% tax
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount
  
  // Search products
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchProducts])
  
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // Add new item to cart
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.unit,
        maxQuantity: product.quantity // Available stock
      }])
    }
    
    // Clear search after adding
    setSearchQuery('')
    setSearchResults([])
  }
  
  const updateQuantity = (id, newQuantity) => {
    const item = cartItems.find(item => item.id === id)
    
    if (item && newQuantity > 0 && newQuantity <= item.maxQuantity) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }
  
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }
  
  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      alert('Please add at least one item to the cart')
      return
    }
    
    if (!customer.trim()) {
      alert('Please enter customer name')
      return
    }
    
    // Create sale object
    const sale = {
      customer: customer,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      subtotal,
      tax: taxAmount,
      total,
      paymentMethod
    }
    
    // Add sale to context
    addSale(sale)
    
    // Navigate back to sales page
    navigate('/sales')
  }
  
  return (
    <div className={styles.newSale}>
      <div className={styles.header}>
        <h1>New Sale</h1>
      </div>
      
      <div className={styles.saleContainer}>
        <div className={styles.productSearch}>
          <h2>Add Products</h2>
          
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map(product => (
                <div key={product.id} className={styles.searchResultItem}>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <div className={styles.productMeta}>
                      <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                      <span className={styles.stock}>
                        {product.quantity} {product.unit} available
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className={`btn btn-outline ${styles.addButton}`}
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.categoriesGrid}>
            <h3>Categories</h3>
            <div className={styles.categories}>
              <button className={styles.categoryButton} onClick={() => setSearchQuery('seeds')}>
                Seeds
              </button>
              <button className={styles.categoryButton} onClick={() => setSearchQuery('fertilizers')}>
                Fertilizers
              </button>
              <button className={styles.categoryButton} onClick={() => setSearchQuery('equipment')}>
                Equipment
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.cart}>
          <h2>Current Sale</h2>
          
          <div className={styles.customerDetails}>
            <div className={styles.formGroup}>
              <label htmlFor="customer">Customer Name</label>
              <input 
                type="text" 
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="paymentMethod">Payment Method</label>
              <select 
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
          </div>
          
          <div className={styles.cartItems}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>No items added yet</p>
                <p>Search for products to add to the sale</p>
              </div>
            ) : (
              <table className={styles.cartTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>₹{item.price.toLocaleString()}</td>
                      <td>
                        <div className={styles.quantityControl}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>
                      <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                      <td>
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax (5%)</span>
              <span>₹{taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div className={styles.cartActions}>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/sales')}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleCompleteSale}
              disabled={cartItems.length === 0}
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewSale