import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { useSales } from '../contexts/SalesContext';
import { FaPlus, FaMinus, FaTrash, FaSearch } from 'react-icons/fa';
import styles from './NewSale.module.css';

const NewSale = () => {
  const navigate = useNavigate();
  const { products = [], searchProducts } = useInventory();
  const { addSale, sales = [] } = useSales();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxRate = 0.05;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Update search results
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchProducts(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchProducts]);

  const addToCart = (product) => {
    const productId = product._id || product.id;
    const existing = cartItems.find(i => i.id === productId);

    if (existing) {
      setCartItems(cartItems.map(i =>
        i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, {
        id: productId,
        name: product.name || 'Unnamed',
        price: product.price || 0,
        unit: product.unit || '',
        maxQuantity: product.quantity || 0,
        quantity: 1,
      }]);
    }

    setSearchQuery('');
    setSearchResults([]);
  };

  const updateQuantity = (id, newQty) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.maxQuantity, newQty)) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  const handleCompleteSale = () => {
    if (!cartItems.length) {
      return alert('Add at least one item');
    }
    if (!customer.trim()) {
      return alert('Enter customer name');
    }

    const sale = {
      id: Date.now().toString(),
      customer,
      paymentMethod,
      items: cartItems.map(i => ({
        productId: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity
      })),
      subtotal,
      tax: taxAmount,
      total,
      date: new Date().toISOString()
    };

    addSale(sale);
    navigate('/sales');
  };

  return (
    <div className={styles.newSale}>
      <h1>New Sale</h1>
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchResults.map(prod => (
          <div key={prod._id || prod.id}>
            {prod.name} – ₹{prod.price}
            <button onClick={() => addToCart(prod)} disabled={prod.quantity === 0}>
              <FaPlus />
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div>
        <h2>Cart</h2>
        {cartItems.length ? (
          <table>
            <thead><tr><th>Name</th><th>Qty</th><th>Price</th><th>Total</th><th>—</th></tr></thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                  <td><button onClick={() => removeItem(item.id)}><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in cart</p>
        )}
      </div>

      {/* Customer & Totals */}
      <div>
        <label>Customer</label>
        <input value={customer} onChange={e => setCustomer(e.target.value)} />

        <label>Payment Method</label>
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="bank">Bank Transfer</option>
        </select>

        <div>
          Subtotal: ₹{subtotal.toFixed(2)} | Tax: ₹{taxAmount.toFixed(2)} | Total: ₹{total.toFixed(2)}
        </div>

        <button onClick={handleCompleteSale}>Complete Sale</button>
        <button onClick={() => navigate('/sales')}>Cancel</button>
      </div>
    </div>
  );
};

export default NewSale;
