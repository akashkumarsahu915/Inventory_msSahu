import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInventory } from '../contexts/InventoryContext'
import { FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa'
import styles from './ProductDetail.module.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, addProduct, updateProduct, deleteProduct } = useInventory()
  const [formData, setFormData] = useState({
    name: '',
    category: 'seeds',
    description: '',
    price: 0,
    quantity: 0,
    unit: 'kg',
    lowStockThreshold: 10,
    imageUrl: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = () => {
    const product = formData;
    console.log('Product:', product);
    if (id === 'new') {
      addProduct(product);
      navigate('/inventory')
    } else {
      // Update existing product
      updateProduct(id, formData)
      navigate('/inventory')
    }
  }

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this product?${id}`)) {
      deleteProduct(id)
      navigate('/inventory')
    }
  }
  //not working properly

  const isNewProduct = id === 'new'
  const title = isNewProduct ? 'Add New Product' : 'Edit Product'

  return (
    <div className={styles.productDetail}>
      <div className={styles.header}>
        <button
          className={`btn btn-outline ${styles.backButton}`}
          onClick={() => navigate('/inventory')}
        >
          <FaArrowLeft /> Back to Inventory
        </button>
        <h1>{title}</h1>
        {!isNewProduct && (
          <button
            className={`btn btn-outline ${styles.deleteButton}`}
            onClick={()=>{handleDelete(id)}
            }
          >
            <FaTrash /> Delete
          </button>
        )}
      </div>

      <form className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formSection}>
            <h2>Product Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="seeds">Seeds</option>
                <option value="fertilizers">Fertilizers</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Inventory Details</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="sets">Sets</option>
                  <option value="box">Box</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lowStockThreshold">Low Stock Alert</label>
                <input
                  type="number"
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {!isNewProduct && products && (
              <div className={styles.productPreview}>
                <h3>Product Preview</h3>
                <div className={styles.previewCard}>
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt={formData.name} />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                  <div className={styles.previewInfo}>
                    <h4>{formData.name}</h4>
                    <p className={styles.previewPrice}>₹{formData.price.toLocaleString()}</p>
                    <p className={styles.previewStock}>Stock: {formData.quantity} {formData.unit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/inventory')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            <FaSave /> Save Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductDetail