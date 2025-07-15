import { useState, useEffect } from 'react'
import { useInventory } from '../contexts/InventoryContext'
import { useSales } from '../contexts/SalesContext'
import { format, startOfWeek, endOfWeek, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { FaDownload, FaCalendarAlt } from 'react-icons/fa'
import styles from './Reports.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Reports = () => {
  const { products = [], getProductsByCategory } = useInventory()
  const { sales = [], getSalesByDateRange } = useSales()

  const [reportType, setReportType] = useState('sales')
  const [timeframe, setTimeframe] = useState('week')
  const [salesData, setSalesData] = useState(null)
  const [categoryData, setCategoryData] = useState(null)
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    if (sales.length && products.length) {
      generateReport()
    }
  }, [reportType, timeframe, sales, products])

  const generateReport = () => {
    let startDate, endDate
    const today = new Date()

    switch (timeframe) {
      case 'week':
        startDate = startOfWeek(today, { weekStartsOn: 1 })
        endDate = endOfWeek(today, { weekStartsOn: 1 })
        break
      case 'month':
        startDate = startOfMonth(today)
        endDate = endOfMonth(today)
        break
      case 'quarter':
        startDate = subMonths(today, 3)
        endDate = today
        break
      default:
        startDate = new Date(today.getFullYear(), 0, 1)
        endDate = today
    }

    const filteredSales = getSalesByDateRange(startDate, endDate)

    if (reportType === 'sales') {
      prepareSalesData(filteredSales)
    } else {
      prepareInventoryData()
    }

    calculateTopProducts(filteredSales)
  }

  const prepareSalesData = (filteredSales) => {
    const salesByPeriod = {}

    filteredSales.forEach(sale => {
      const date = new Date(sale.date)
      const key = (timeframe === 'week' || timeframe === 'month') ? format(date, 'MMM dd') : format(date, 'MMM yyyy')

      salesByPeriod[key] = (salesByPeriod[key] || 0) + sale.total
    })

    const labels = Object.keys(salesByPeriod)
    const data = Object.values(salesByPeriod)

    setSalesData({
      labels,
      datasets: [{
        label: 'Sales',
        data,
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1
      }]
    })

    const salesByCategory = {
      seeds: 0,
      fertilizers: 0,
      equipment: 0
    }

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p._id === item.productId || p.id === item.productId)
        if (product && product.category) {
          salesByCategory[product.category] += item.total
        }
      })
    })

    setCategoryData({
      labels: ['Seeds', 'Fertilizers', 'Equipment'],
      datasets: [{
        data: [
          salesByCategory.seeds,
          salesByCategory.fertilizers,
          salesByCategory.equipment
        ],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(33, 150, 243, 0.7)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(33, 150, 243, 1)'
        ],
        borderWidth: 1
      }]
    })
  }

  const prepareInventoryData = () => {
    const seedProducts = getProductsByCategory('seeds') || []
    const fertilizerProducts = getProductsByCategory('fertilizers') || []
    const equipmentProducts = getProductsByCategory('equipment') || []

    const seedsValue = seedProducts.reduce((total, p) => total + p.price * p.quantity, 0)
    const fertilizersValue = fertilizerProducts.reduce((total, p) => total + p.price * p.quantity, 0)
    const equipmentValue = equipmentProducts.reduce((total, p) => total + p.price * p.quantity, 0)

    setCategoryData({
      labels: ['Seeds', 'Fertilizers', 'Equipment'],
      datasets: [{
        data: [seedsValue, fertilizersValue, equipmentValue],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(33, 150, 243, 0.7)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(33, 150, 243, 1)'
        ],
        borderWidth: 1
      }]
    })

    setSalesData({
      labels: ['Seeds', 'Fertilizers', 'Equipment'],
      datasets: [{
        label: 'Inventory Items',
        data: [seedProducts.length, fertilizerProducts.length, equipmentProducts.length],
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1
      }]
    })
  }

  const calculateTopProducts = (filteredSales) => {
    const productSales = {}

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            name: item.name,
            quantity: 0,
            revenue: 0
          }
        }
        productSales[item.productId].quantity += item.quantity
        productSales[item.productId].revenue += item.total
      })
    })

    const topProductsArray = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    setTopProducts(topProductsArray)
  }

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h1>Reports</h1>
        <div className={styles.headerControls}>
          <button className={`btn btn-outline ${styles.exportButton}`}>
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      <div className={styles.reportControls}>
        <div className={styles.controlGroup}>
          <label>Report Type</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.controlButton} ${reportType === 'sales' ? styles.active : ''}`}
              onClick={() => setReportType('sales')}
            >Sales</button>
            <button
              className={`${styles.controlButton} ${reportType === 'inventory' ? styles.active : ''}`}
              onClick={() => setReportType('inventory')}
            >Inventory</button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>Time Period</label>
          <div className={styles.timeSelector}>
            <FaCalendarAlt className={styles.calendarIcon} />
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2>{reportType === 'sales' ? 'Sales Trend' : 'Inventory Distribution'}</h2>
          <div className={styles.chartContainer}>
            {salesData && <Bar data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2>{reportType === 'sales' ? 'Sales by Category' : 'Inventory Value by Category'}</h2>
          <div className={styles.pieContainer}>
            {categoryData && <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false }} />}
          </div>
        </div>
      </div>

      <div className={styles.reportTable}>
        <h2>{reportType === 'sales' ? 'Top Selling Products' : 'Inventory Status'}</h2>
        {reportType === 'sales' ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? topProducts.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.revenue.toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className={styles.emptyMessage}>No sales data for selected period</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Products</th>
                <th>Avg. Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {['seeds', 'fertilizers', 'equipment'].map(category => {
                const catProducts = getProductsByCategory(category) || []
                const totalValue = catProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)
                const avgPrice = catProducts.length > 0 ? catProducts.reduce((sum, p) => sum + p.price, 0) / catProducts.length : 0
                return (
                  <tr key={category}>
                    <td className={styles.capitalize}>{category}</td>
                    <td>{catProducts.length}</td>
                    <td>₹{avgPrice.toFixed(2)}</td>
                    <td>₹{totalValue.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Reports
