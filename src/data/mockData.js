// Mock products data
export const mockProducts = [
  {
    id: '1',
    name: 'Premium Wheat Seeds',
    category: 'seeds',
    description: 'High-yield wheat seeds for optimal crop production.',
    price: 599.99,
    quantity: 150,
    unit: 'kg',
    lowStockThreshold: 30,
    imageUrl: 'https://images.unsplash.com/photo-1567881397166-0ea8b938f0c5?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'Organic Fertilizer',
    category: 'fertilizers',
    description: 'Natural, chemical-free fertilizer for organic farming.',
    price: 349.99,
    quantity: 75,
    unit: 'kg',
    lowStockThreshold: 20,
    imageUrl: 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-01-20T10:15:00Z',
    updatedAt: '2024-01-20T10:15:00Z'
  },
  {
    id: '3',
    name: 'Hand Tiller',
    category: 'equipment',
    description: 'Manual tiller for small garden plots and difficult-to-reach areas.',
    price: 1199.99,
    quantity: 45,
    unit: 'pcs',
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1642371891690-3c2921da9841?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-01-22T14:45:00Z',
    updatedAt: '2024-01-22T14:45:00Z'
  },
  {
    id: '4',
    name: 'Rice Seeds',
    category: 'seeds',
    description: 'High-quality rice seeds for optimal yield.',
    price: 649.99,
    quantity: 200,
    unit: 'kg',
    lowStockThreshold: 40,
    imageUrl: 'https://images.unsplash.com/photo-1626016248855-9dabd9d5251e?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-01-25T09:20:00Z',
    updatedAt: '2024-01-25T09:20:00Z'
  },
  {
    id: '5',
    name: 'NPK Fertilizer',
    category: 'fertilizers',
    description: 'Balanced NPK formula for general crop growth.',
    price: 499.99,
    quantity: 120,
    unit: 'kg',
    lowStockThreshold: 25,
    imageUrl: 'https://images.unsplash.com/photo-1536657689364-eabe91b4c6c0?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-01-28T11:30:00Z',
    updatedAt: '2024-01-28T11:30:00Z'
  },
  {
    id: '6',
    name: 'Garden Hoe',
    category: 'equipment',
    description: 'Durable garden hoe for weeding and soil cultivation.',
    price: 799.99,
    quantity: 60,
    unit: 'pcs',
    lowStockThreshold: 15,
    imageUrl: 'https://images.unsplash.com/photo-1625806335358-a2a5c1a583b6?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-01-30T13:15:00Z',
    updatedAt: '2024-01-30T13:15:00Z'
  },
  {
    id: '7',
    name: 'Corn Seeds',
    category: 'seeds',
    description: 'High-yield hybrid corn seeds for commercial farming.',
    price: 799.99,
    quantity: 8,
    unit: 'kg',
    lowStockThreshold: 20,
    imageUrl: 'https://images.unsplash.com/photo-1601593768799-7a7c798f6a33?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-02-02T10:40:00Z',
    updatedAt: '2024-02-02T10:40:00Z'
  },
  {
    id: '8',
    name: 'Phosphate Fertilizer',
    category: 'fertilizers',
    description: 'Phosphate-rich fertilizer for root development and flowering.',
    price: 599.99,
    quantity: 90,
    unit: 'kg',
    lowStockThreshold: 20,
    imageUrl: 'https://images.unsplash.com/photo-1626017364487-5fa34fe82dfb?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-02-05T09:50:00Z',
    updatedAt: '2024-02-05T09:50:00Z'
  },
  {
    id: '9',
    name: 'Sprinkler System',
    category: 'equipment',
    description: 'Automated sprinkler system for efficient irrigation.',
    price: 3499.99,
    quantity: 5,
    unit: 'sets',
    lowStockThreshold: 3,
    imageUrl: 'https://images.unsplash.com/photo-1585150810265-716b6bacb67e?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-02-08T15:25:00Z',
    updatedAt: '2024-02-08T15:25:00Z'
  },
  {
    id: '10',
    name: 'Potato Seeds',
    category: 'seeds',
    description: 'Disease-resistant potato seeds for better harvest.',
    price: 449.99,
    quantity: 180,
    unit: 'kg',
    lowStockThreshold: 35,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&q=85&w=500',
    createdAt: '2024-02-10T12:10:00Z',
    updatedAt: '2024-02-10T12:10:00Z'
  }
];

// Mock sales data
export const mockSales = [
  {
    id: '1',
    customer: 'Rajesh Kumar',
    date: '2024-02-15T09:30:00Z',
    items: [
      { productId: '1', name: 'Premium Wheat Seeds', quantity: 50, price: 599.99, total: 29999.5 },
      { productId: '5', name: 'NPK Fertilizer', quantity: 15, price: 499.99, total: 7499.85 }
    ],
    subtotal: 37499.35,
    tax: 1874.97,
    total: 39374.32,
    paymentMethod: 'cash',
    status: 'completed'
  },
  {
    id: '2',
    customer: 'Anita Sharma',
    date: '2024-02-15T11:45:00Z',
    items: [
      { productId: '3', name: 'Hand Tiller', quantity: 2, price: 1199.99, total: 2399.98 },
      { productId: '6', name: 'Garden Hoe', quantity: 3, price: 799.99, total: 2399.97 }
    ],
    subtotal: 4799.95,
    tax: 240.00,
    total: 5039.95,
    paymentMethod: 'upi',
    status: 'completed'
  },
  {
    id: '3',
    customer: 'Suresh Patel',
    date: '2024-02-16T14:20:00Z',
    items: [
      { productId: '2', name: 'Organic Fertilizer', quantity: 25, price: 349.99, total: 8749.75 }
    ],
    subtotal: 8749.75,
    tax: 437.49,
    total: 9187.24,
    paymentMethod: 'cash',
    status: 'completed'
  },
  {
    id: '4',
    customer: 'Vikram Singh',
    date: '2024-02-17T10:05:00Z',
    items: [
      { productId: '4', name: 'Rice Seeds', quantity: 30, price: 649.99, total: 19499.7 },
      { productId: '8', name: 'Phosphate Fertilizer', quantity: 10, price: 599.99, total: 5999.9 }
    ],
    subtotal: 25499.6,
    tax: 1274.98,
    total: 26774.58,
    paymentMethod: 'card',
    status: 'completed'
  },
  {
    id: '5',
    customer: 'Priya Desai',
    date: '2024-02-18T15:30:00Z',
    items: [
      { productId: '9', name: 'Sprinkler System', quantity: 1, price: 3499.99, total: 3499.99 }
    ],
    subtotal: 3499.99,
    tax: 175.00,
    total: 3674.99,
    paymentMethod: 'upi',
    status: 'completed'
  },
  {
    id: '6',
    customer: 'Manoj Verma',
    date: '2024-02-19T12:15:00Z',
    items: [
      { productId: '10', name: 'Potato Seeds', quantity: 20, price: 449.99, total: 8999.8 },
      { productId: '2', name: 'Organic Fertilizer', quantity: 15, price: 349.99, total: 5249.85 }
    ],
    subtotal: 14249.65,
    tax: 712.48,
    total: 14962.13,
    paymentMethod: 'cash',
    status: 'completed'
  },
  {
    id: '7',
    customer: 'Geeta Rao',
    date: new Date().toISOString(), // Today
    items: [
      { productId: '7', name: 'Corn Seeds', quantity: 12, price: 799.99, total: 9599.88 },
      { productId: '5', name: 'NPK Fertilizer', quantity: 8, price: 499.99, total: 3999.92 }
    ],
    subtotal: 13599.8,
    tax: 679.99,
    total: 14279.79,
    paymentMethod: 'upi',
    status: 'completed'
  },
  {
    id: '8',
    customer: 'Arun Joshi',
    date: new Date().toISOString(), // Today
    items: [
      { productId: '6', name: 'Garden Hoe', quantity: 5, price: 799.99, total: 3999.95 }
    ],
    subtotal: 3999.95,
    tax: 200.00,
    total: 4199.95,
    paymentMethod: 'cash',
    status: 'completed'
  }
];

// Categories
export const categories = [
  { id: 'seeds', name: 'Seeds', icon: 'seed' },
  { id: 'fertilizers', name: 'Fertilizers', icon: 'bottle' },
  { id: 'equipment', name: 'Equipment', icon: 'tool' }
];

// Payment methods
export const paymentMethods = [
  { id: 'cash', name: 'Cash' },
  { id: 'card', name: 'Card' },
  { id: 'upi', name: 'UPI' },
  { id: 'bank', name: 'Bank Transfer' }
];