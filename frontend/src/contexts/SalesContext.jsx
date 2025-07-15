import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SalesContext = createContext();
export const useSales = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// ... other imports
const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const addSale = async (sale) => {
    try {
      const res = await axios.post(
        'https://mssahu-inventory-backend.onrender.com/admin/sellproduct',
        sale,
        { withCredentials: true }
      );

      const newSale = res.data.sale || sale;
      setSales((prev) => [...prev, newSale]);
      console.log('New sale added:', newSale);
    } catch (err) {
      console.error('Error adding sale:', err);
    }
  };

  const getSalesByDateRange = (start, end) => {
    if (!Array.isArray(sales)) return [];
    return sales.filter((sale) => {
      const date = new Date(sale.date);
      return date >= start && date <= end;
    });
  };

  const calculateTotalSales = (salesList = []) => {
    return salesList.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return sales.filter((sale) => sale.date?.startsWith(today));
  };

  const value = {
    sales,
    loading,
    error,
    addSale,
    getSalesByDateRange,
    calculateTotalSales,
    getTodaySales // ✅ now available in Dashboard
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};
