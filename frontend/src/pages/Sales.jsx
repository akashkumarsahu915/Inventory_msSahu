import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSales } from '../contexts/SalesContext.jsx'
import { format } from 'date-fns'
import { FaPlus, FaDownload, FaCalendarAlt } from 'react-icons/fa'
import styles from './Sales.module.css'

const Sales = () => {
  const { sales, loading } = useSales()
  const [filteredSales, setFilteredSales] = useState([])
  const [dateRange, setDateRange] = useState('all')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')

  useEffect(() => {
    if (!loading) {
      filterSales(dateRange)
    }
  }, [sales, loading, dateRange])

  const filterSales = (range) => {
    let filtered = [...sales]

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const lastWeekStart = new Date(today)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    const lastMonthStart = new Date(today)
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)

    switch (range) {
      case 'today':
        filtered = sales.filter(sale => {
          const saleDate = new Date(sale.date)
          return saleDate >= today
        })
        break
      case 'yesterday':
        filtered = sales.filter(sale => {
          const saleDate = new Date(sale.date)
          return saleDate >= yesterday && saleDate < today
        })
        break
      case 'week':
        filtered = sales.filter(sale => {
          const saleDate = new Date(sale.date)
          return saleDate >= lastWeekStart
        })
        break
      case 'month':
        filtered = sales.filter(sale => {
          const saleDate = new Date(sale.date)
          return saleDate >= lastMonthStart
        })
        break
      case 'custom':
        if (customDateFrom && customDateTo) {
          const fromDate = new Date(customDateFrom)
          const toDate = new Date(customDateTo)
          toDate.setHours(23, 59, 59, 999) // End of day

          filtered = sales.filter(sale => {
            const saleDate = new Date(sale.date)
            return saleDate >= fromDate && saleDate <= toDate
          })
        }
        break
      default:
        // 'all' - no filtering needed
        break
    }

    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredSales(filtered)

  }

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value)
  }

  const handleCustomDateChange = () => {
    if (customDateFrom && customDateTo) {
      filterSales('custom')
    }
  }

  const calculateTotal = () => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0)
  }

  if (loading) {
    return <div className={styles.loading}>Loading sales data...</div>
  }

  return (
    <div className={styles.sales}>
      <div className={styles.header}>
        <h1>Sales History</h1>
        <Link to="/sales/new" className={`btn btn-primary ${styles.newSaleButton}`}>
          <FaPlus /> New Sale
        </Link>
      </div>

      <div className={styles.filters}>
        <div className={styles.dateFilter}>
          <div className={styles.filterIcon}>
            <FaCalendarAlt />
          </div>
          <select value={dateRange} onChange={handleDateRangeChange}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {dateRange === 'custom' && (
          <div className={styles.customDateRange}>
            <div className={styles.dateInput}>
              <label htmlFor="dateFrom">From</label>
              <input
                type="date"
                id="dateFrom"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
              />
            </div>
            <div className={styles.dateInput}>
              <label htmlFor="dateTo">To</label>
              <input
                type="date"
                id="dateTo"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
              />
            </div>
            <button
              className="btn btn-outline"
              onClick={handleCustomDateChange}
            >
              Apply
            </button>
          </div>
        )}

        <button className={`btn btn-outline ${styles.exportButton}`}>
          <FaDownload /> Export
        </button>
      </div>

      <div className={styles.salesSummary}>
        <div className={styles.summaryCard}>
          <h3>Total Sales</h3>
          <p className={styles.summaryValue}>₹{calculateTotal().toLocaleString()}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Transactions</h3>
          <p className={styles.summaryValue}>{filteredSales.length}</p>
        </div>
        <div className={styles.summaryCard}>
          <h3>Average Sale</h3>
          <p className={styles.summaryValue}>
            ₹{filteredSales.length ? (calculateTotal() / filteredSales.length).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
          </p>
        </div>
      </div>

      <div className={styles.salesTable}>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date & Time</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                <td>INV-{sale.id}</td>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>{sale.customer}</td>
                <td>
                  {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                  <span className={styles.itemsList}>
                    {sale.items.map(item => item.name).join(', ')}
                  </span>
                </td>
                <td>
                  <span className={styles.paymentMethod}>
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className={styles.saleTotal}>₹{sale.total.toLocaleString()}</td>
                <td>
                  <Link to={`/sales/${sale.id}`} className={styles.viewButton}>
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="7" className={styles.emptyMessage}>
                  No sales found for the selected period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales