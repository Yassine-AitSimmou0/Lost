import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // Initialize products from localStorage or default data
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('adminProducts');
      if (stored) {
        return JSON.parse(stored);
      }
      // Default products if none exist
      return [
        {
          id: 1,
          name: 'Lost Hoodie',
          description: 'Urban oversized hoodie. Free, bold, and made for the streets.',
          image: '/src/Assets/Images/Mwader.png',
          tag: 'Limited Edition',
          stock: 15,
          price: 89.99,
          category: 'Hoodies',
          status: 'active',
          sales: 23,
          sizes: {
            XS: 2,
            S: 3,
            M: 4,
            L: 3,
            XL: 2,
            XXL: 1
          },
          colors: ['Black'],
          material: '100% Cotton',
          care: 'Machine wash cold'
        },
        {
          id: 2,
          name: 'Cargo Pants',
          description: 'Loose fit, deep pockets, ready for any city adventure.',
          image: '/src/Assets/Images/Mwader.png',
          tag: 'Limited Edition',
          stock: 8,
          price: 129.99,
          category: 'Pants',
          status: 'active',
          sales: 18,
          sizes: {
            XS: 1,
            S: 2,
            M: 2,
            L: 2,
            XL: 1,
            XXL: 0
          },
          colors: ['Black', 'Olive'],
          material: 'Cotton Blend',
          care: 'Machine wash cold'
        },
        {
          id: 3,
          name: 'Shadow Jacket',
          description: 'Boxy, cropped, and built for the night. No limits.',
          image: '/src/Assets/Images/Mwader.png',
          tag: 'Limited Edition',
          stock: 5,
          price: 149.99,
          category: 'Jackets',
          status: 'active',
          sales: 12,
          sizes: {
            XS: 0,
            S: 1,
            M: 2,
            L: 1,
            XL: 1,
            XXL: 0
          },
          colors: ['Black'],
          material: 'Polyester Blend',
          care: 'Dry clean only'
        }
      ];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('adminOrders');
      return stored ? JSON.parse(stored) : [
        { id: 1, customer: 'John Doe', total: 89.99, status: 'completed', date: '2024-01-15', items: [1] },
        { id: 2, customer: 'Jane Smith', total: 279.98, status: 'pending', date: '2024-01-14', items: [1, 2] },
        { id: 3, customer: 'Mike Johnson', total: 149.99, status: 'shipped', date: '2024-01-13', items: [3] }
      ];
    } catch {
      return [];
    }
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState(() => {
    try {
      const stored = localStorage.getItem('newsletterSubscribers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('adminOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('newsletterSubscribers', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);

  // Product management functions
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(), // Simple ID generation
      ...productData,
      status: 'active',
      sales: 0,
      image: productData.image || '/src/Assets/Images/Mwader.png',
      sizes: productData.sizes || { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
      colors: productData.colors || ['Black'],
      material: productData.material || '',
      care: productData.care || ''
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getActiveProducts = () => {
    return products.filter(product => product.status === 'active');
  };

  // Order management functions
  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Update product sales and stock
    orderData.items.forEach(itemId => {
      const product = products.find(p => p.id === itemId);
      if (product) {
        updateProduct(itemId, {
          sales: product.sales + 1,
          stock: Math.max(0, product.stock - 1)
        });
      }
    });
    
    // Send enhanced notification if enabled
    try {
      const whatsappEnabled = localStorage.getItem('whatsappNotifications');
      const twilioConfig = localStorage.getItem('twilioConfig');
      
      if (twilioConfig) {
        // Try Twilio first (automatic)
        import('../utils/twilioWhatsApp').then(module => {
          const twilioWhatsApp = module.default;
          twilioWhatsApp.sendOrderNotification(newOrder).catch(error => {
            console.log('Twilio notification failed, falling back to manual WhatsApp:', error);
            // Fallback to manual WhatsApp
            if (whatsappEnabled === 'true') {
              import('../utils/whatsappNotifications').then(module => {
                const whatsAppNotifier = module.default;
                whatsAppNotifier.sendEnhancedNotification(newOrder);
              }).catch(error => {
                console.log('WhatsApp notification not available:', error);
              });
            }
          });
        }).catch(error => {
          console.log('Twilio not available, using manual WhatsApp:', error);
          // Fallback to manual WhatsApp
          if (whatsappEnabled === 'true') {
            import('../utils/whatsappNotifications').then(module => {
              const whatsAppNotifier = module.default;
              whatsAppNotifier.sendEnhancedNotification(newOrder);
            }).catch(error => {
              console.log('WhatsApp notification not available:', error);
            });
          }
        });
      } else if (whatsappEnabled === 'true') {
        // Use manual WhatsApp if Twilio not configured
        import('../utils/whatsappNotifications').then(module => {
          const whatsAppNotifier = module.default;
          whatsAppNotifier.sendEnhancedNotification(newOrder);
        }).catch(error => {
          console.log('WhatsApp notification not available:', error);
        });
      }
    } catch (error) {
      console.log('Error sending WhatsApp notification:', error);
    }
    
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  // Newsletter management
  const addNewsletterSubscriber = (email) => {
    if (!newsletterSubscribers.includes(email)) {
      setNewsletterSubscribers(prev => [...prev, email]);
      return true;
    }
    return false;
  };

  // Analytics functions
  const getAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(product => product.stock < 10).length;
    const totalSubscribers = newsletterSubscribers.length;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts,
      totalSubscribers
    };
  };

  const value = {
    // Data
    products,
    orders,
    newsletterSubscribers,
    
    // Product functions
    addProduct,
    updateProduct,
    deleteProduct,
    getActiveProducts,
    
    // Order functions
    addOrder,
    updateOrderStatus,
    
    // Newsletter functions
    addNewsletterSubscriber,
    
    // Analytics
    getAnalytics
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 