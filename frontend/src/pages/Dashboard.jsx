import { useInventory } from '../contexts/InventoryContext'
import { useSales } from '../contexts/SalesContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import {
  FaBoxOpen,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaChartLine
} from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import styles from './Dashboard.module.css'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const { products, loading, getLowStockProducts } = useInventory();

  const {
    sales,
    getTodaySales,
    calculateTotalSales,
    getSalesDataForCharts
  } = useSales()

  const [salesData, setSalesData] = useState(null)

  useEffect(() => {
    // Prepare sales chart data
    const chartData = getSalesDataForCharts('daily', 7)

    setSalesData({
      labels: chartData.map(item => format(new Date(item.date), 'MMM dd')),
      datasets: [
        {
          label: 'Sales',
          data: chartData.map(item => item.value),
          fill: false,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: 'rgba(76, 175, 80, 1)',
          tension: 0.4
        }
      ]
    })
  }, [getSalesDataForCharts])

  const todaySales = getTodaySales()
  const todayTotal = calculateTotalSales(todaySales)

if (loading) return <div>Loading Dashboard...</div>; 

const lowStockProducts = getLowStockProducts();

  // Calculate total inventory value
  const totalInventoryValue = Array.isArray(products)
  ? products.reduce((total, product) => total + (product.price * product.quantity), 0)
  : 0;


  // Calculate total sales (all time)
  const totalSalesAmount = calculateTotalSales(sales)

  // Calculate sales increase (demo purpose - would be calculated from actual data)
  const salesIncrease = 12.5 // Percentage

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
        <span className={styles.currentDate}>
          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
            <FaShoppingCart color="#4CAF50" />
          </div>
          <div className={styles.statInfo}>
            <h3>Today's Sales</h3>
            <p className={styles.statValue}>₹{todayTotal.toLocaleString()}</p>
            <span className={styles.statMeta}>
              {todaySales.length} transactions
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(121, 85, 72, 0.1)' }}>
            <FaBoxOpen color="#795548" />
          </div>
          <div className={styles.statInfo}>
            <h3>Inventory Value</h3>
            <p className={styles.statValue}>₹{totalInventoryValue.toLocaleString()}</p>
            <span className={styles.statMeta}>
              {products.length} products
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
            <FaExclamationTriangle color="#FF9800" />
          </div>
          <div className={styles.statInfo}>
            <h3>Low Stock</h3>
            <p className={styles.statValue}>{lowStockProducts.length}</p>
            <span className={styles.statMeta}>
              <Link to="/inventory" className={styles.statLink}>
                View items
              </Link>
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
            <FaChartLine color="#2196F3" />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Sales</h3>
            <p className={styles.statValue}>₹{totalSalesAmount.toLocaleString()}</p>
            <span className={`${styles.statMeta} ${salesIncrease > 0 ? styles.positive : styles.negative}`}>
              {salesIncrease > 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(salesIncrease)}% this month
            </span>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2>Sales Trend</h2>
            <select className={styles.periodSelect}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            {salesData && <Line
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />}
          </div>
        </div>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.recentSales}>
          <div className={styles.sectionHeader}>
            <h2>Recent Sales</h2>
            <Link to="/sales" className={styles.viewAll}>View All</Link>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 5).map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.customer}</td>
                    <td>
                      {sale.date ? format(new Date(sale.date), 'MMM dd, HH:mm') : 'N/A'}
                    </td>

                    <td>{sale.items.length} items</td>
                    <td>₹{sale.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.lowStock}>
          <div className={styles.sectionHeader}>
            <h2>Low Stock Items</h2>
            <Link to="/inventory" className={styles.viewAll}>View All</Link>
          </div>

          <div className={styles.lowStockItems}>
            {lowStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className={styles.lowStockItem}>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <span className={styles.category}>{product.category}</span>
                </div>
                <div className={styles.stockInfo}>
                  <div className={styles.stockBar}>
                    <div
                      className={styles.stockLevel}
                      style={{
                        width: `${Math.min(100, (product.quantity / product.lowStockThreshold) * 100)}%`,
                        backgroundColor: product.quantity < 5 ? 'var(--color-error-500)' : 'var(--color-warning-500)'
                      }}
                    ></div>
                  </div>
                  <span className={styles.stockText}>
                    {product.quantity} {product.unit} left
                  </span>
                </div>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <div className={styles.emptyState}>
                <p>No low stock items currently.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
