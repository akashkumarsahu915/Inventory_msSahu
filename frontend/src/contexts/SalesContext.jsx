import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SalesContext = createContext();
export const useSales = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all sales from the server
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get('https://mssahu-inventory-backend.onrender.com/admin/getAllSellProduct', {
          withCredentials: true
        });

        const fetchedSales = res.data.sellitems || [];
        setSales(fetchedSales);
        console.log('Fetched sales:', fetchedSales);
      } catch (err) {
        console.error('Failed to fetch sales:', err);
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Add a new sale
  const addSale = async (sale) => {
    try {
      const res = await axios.post(
        'https://mssahu-inventory-backend.onrender.com/admin/sellproduct',
        sale,
        { withCredentials: true }
      );

      const newSale = res.data.sale || sale; // fallback if API doesn’t return new sale
      setSales((prev) => [...prev, newSale]);
      console.log('New sale added:', newSale);
    } catch (err) {
      console.error('Error adding sale:', err);
    }
  };

  // Get sales within a specific date range
  const getSalesByDateRange = (start, end) => {
    if (!Array.isArray(sales)) return [];
    return sales.filter((sale) => {
      const date = new Date(sale.date);
      return date >= start && date <= end;
    });
  };

  // Calculate total sales in a range
  const calculateTotalSales = (salesList = []) => {
    return salesList.reduce((sum, sale) => sum + sale.total, 0);
  };

  const value = {
    sales,
    loading,
    error,
    addSale,
    getSalesByDateRange,
    calculateTotalSales
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};
