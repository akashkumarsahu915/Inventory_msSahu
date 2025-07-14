import { createContext, useState, useContext, useEffect } from 'react'
import { useInventory } from './InventoryContext'
import { format, set } from 'date-fns'
import axios from 'axios'

const SalesContext = createContext()

export const useSales = () => useContext(SalesContext)

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { updateStock } = useInventory()

  // Load mock data on initial render

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/getAllSellProduct")
        setSales(response.data.sellitems)
        console.log(response.data.sellitems)
        setLoading(false)

      } catch (error) {
        setError(error)
        console.log(error);
        setLoading(false)

      }
    }
    fetchSales()
  
  }, [])


  // Add a new sale
  const addSale = async(sale) => {
    const responce = await axios.post("http://localhost:3000/admin/sellproduct", sale)
    console.log(responce)
  }

  // Get sales for a specific date range
  const getSalesByDateRange = (startDate, endDate) => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate >= startDate && saleDate <= endDate
    })
  }

  // Get today's sales
  const getTodaySales = () => {
    const today = new Date()
    const todayString = format(today, 'yyyy-MM-dd')

    return sales.filter(sale => {
      if (!sale.date) return false; // 👈 skip if date is missing
      const parsedDate = new Date(sale.date);
      if (isNaN(parsedDate)) return false; // 👈 skip if invalid
      const saleDate = format(parsedDate, 'yyyy-MM-dd');
      return saleDate === todayString;
    });

  }

  // Calculate total sales amount for a given date range
  const calculateTotalSales = (salesList) => {
    return salesList.reduce((total, sale) => total + sale.total, 0)
  }

  // Get sales by product id
  const getSalesByProduct = (productId) => {
    return sales.filter(sale =>
      sale.items.some(item => item.productId === productId)
    )
  }

  // Get sales data for charts (daily, weekly, monthly)
  const getSalesDataForCharts = (period = 'daily', limit = 7) => {
    // Implementation would depend on your charting needs
    // This is a simple example for daily data
    const salesData = {}

    // Get recent sales based on period and limit
    const recentSales = [...sales]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit * 3) // Get more than we need to ensure we have enough unique dates

    // Group by date (for daily view)
    recentSales.forEach(sale => {
  if (!sale.date) return;
  const parsedDate = new Date(sale.date);
  if (isNaN(parsedDate)) return;

  const dateStr = format(parsedDate, 'yyyy-MM-dd');
  if (!salesData[dateStr]) {
    salesData[dateStr] = 0;
  }
  salesData[dateStr] += sale.total;
});


    // Convert to array and limit to requested number of data points
    const chartData = Object.entries(salesData)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-limit)

    return chartData
  }

  const value = {
    sales,
    loading,
    error,
    addSale,
    getSalesByDateRange,
    getTodaySales,
    calculateTotalSales,
    getSalesByProduct,
    getSalesDataForCharts
  }

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  )
}