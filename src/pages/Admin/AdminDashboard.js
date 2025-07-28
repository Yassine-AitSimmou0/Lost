import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import authService from '../../utils/auth';
import auditLogger from '../../utils/auditLogger';
import logo from '../../Assets/Images/Mwader.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    products, 
    orders, 
    newsletterSubscribers, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    addNewsletterSubscriber 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [moroccoTime, setMoroccoTime] = useState('');
  const [securityStats, setSecurityStats] = useState({});
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [securitySettings, setSecuritySettings] = useState({
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 30,
    jwtExpiry: 24,
    auditLogging: true,
    rateLimiting: true,
    accountLockout: true,
    sessionTimeoutEnabled: true,
    securityPin: '123456',
    whatsappNotifications: true
  });

  // Product management state
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    sizes: {},
    colors: [],
    material: '',
    care: ''
  });

  // Notifications state
  const [whatsappEnabled, setWhatsappEnabled] = useState(localStorage.getItem('whatsappNotifications') === 'true');
  const [twilioConfig, setTwilioConfig] = useState(JSON.parse(localStorage.getItem('twilioConfig') || 'null'));

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token || !authService.validateSession(token)) {
        navigate('/admin/login');
        return;
      }
      auditLogger.log('LOGIN_SUCCESS', { message: 'Admin dashboard accessed' });
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    auditLogger.log('LOGOUT', { message: 'Admin logged out' });
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const handleSecurityTabClick = () => {
    setShowPinModal(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === securitySettings.securityPin) {
      setShowPinModal(false);
      setPin('');
      setActiveTab('security');
      auditLogger.log('SECURITY_ACCESS', { message: 'Security tab accessed with PIN' });
    } else {
      alert('Incorrect PIN');
      auditLogger.log('SECURITY_ACCESS_FAILED', { message: 'Failed PIN attempt' });
    }
  };

  // Product management functions
  const handleImageUpload = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setEditingProduct({ ...editingProduct, image: e.target.result });
        } else {
          setNewProduct({ ...newProduct, image: e.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size, value, isEditing = false) => {
    if (isEditing) {
      setEditingProduct({
        ...editingProduct,
        sizes: { ...editingProduct.sizes, [size]: value }
      });
    } else {
      setNewProduct({
        ...newProduct,
        sizes: { ...newProduct.sizes, [size]: value }
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
    auditLogger.log('PRODUCT_UPDATED', { message: `Product ${editingProduct.name} updated` });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      active: true,
      dateAdded: new Date().toISOString()
    };
    addProduct(productToAdd);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      image: '',
      stock: '',
      sizes: {},
      colors: [],
      material: '',
      care: ''
    });
    auditLogger.log('PRODUCT_ADDED', { message: `Product ${productToAdd.name} added` });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      auditLogger.log('PRODUCT_DELETED', { message: `Product with ID ${id} deleted` });
    }
  };

  // Order management functions
  const handleUpdateOrderStatus = (id, status) => {
    updateOrderStatus(id, status);
    auditLogger.log('ORDER_STATUS_UPDATED', { message: `Order ${id} status updated to ${status}` });
  };

  // Notification functions
  const handleEnableNotifications = async () => {
    try {
      const whatsappNotifier = await import('../../utils/whatsappNotifications');
      setWhatsappEnabled(true);
      localStorage.setItem('whatsappNotifications', 'true');
      auditLogger.log('NOTIFICATIONS_ENABLED', { message: 'WhatsApp notifications enabled' });
      alert('WhatsApp notifications enabled!');
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert('Failed to enable notifications. Please check the console for details.');
    }
  };

  const handleDisableNotifications = () => {
    setWhatsappEnabled(false);
    localStorage.setItem('whatsappNotifications', 'false');
    auditLogger.log('NOTIFICATIONS_DISABLED', { message: 'WhatsApp notifications disabled' });
    alert('WhatsApp notifications disabled!');
  };

  const handleTestNotification = async () => {
    try {
      const whatsappNotifier = await import('../../utils/whatsappNotifications');
      const testOrder = {
        id: 'TEST-001',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+1234567890',
        items: [{ name: 'Test Product', quantity: 1, price: 99.99 }],
        total: 99.99,
        status: 'pending',
        date: new Date().toISOString()
      };
      whatsappNotifier.default.sendEnhancedNotification(testOrder);
      auditLogger.log('TEST_NOTIFICATION_SENT', { message: 'Test notification sent' });
      alert('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Failed to send test notification. Please check the console for details.');
    }
  };

  const handleTestOrder = () => {
    const testOrder = {
      id: 'TEST-001',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+1234567890',
      items: [{ name: 'Test Product', quantity: 1, price: 99.99 }],
      total: 99.99,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    // Add test order to orders list
    const updatedOrders = [...orders, testOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    auditLogger.log('TEST_ORDER_CREATED', { message: 'Test order created' });
    alert('Test order created! Check the Orders tab to see it.');
  };

  const handleConfigureTwilio = () => {
    const accountSid = prompt('Enter your Twilio Account SID:');
    const authToken = prompt('Enter your Twilio Auth Token:');
    const fromNumber = prompt('Enter your Twilio WhatsApp number (e.g., whatsapp:+1234567890):');
    const toNumber = prompt('Enter your WhatsApp number (e.g., whatsapp:+1234567890):');

    if (accountSid && authToken && fromNumber && toNumber) {
      const config = { accountSid, authToken, fromNumber, toNumber };
      setTwilioConfig(config);
      localStorage.setItem('twilioConfig', JSON.stringify(config));
      auditLogger.log('TWILIO_CONFIGURED', { message: 'Twilio API configured' });
      alert('Twilio API configured successfully!');
    } else {
      alert('Please provide all required Twilio configuration details.');
    }
  };

  const handleTestTwilio = async () => {
    if (!twilioConfig) {
      alert('Please configure Twilio API first.');
      return;
    }

    try {
      const twilioWhatsApp = await import('../../utils/twilioWhatsApp');
      const testOrder = {
        id: 'TWILIO-TEST-001',
        customerName: 'Twilio Test Customer',
        customerEmail: 'twilio-test@example.com',
        customerPhone: '+1234567890',
        items: [{ name: 'Twilio Test Product', quantity: 1, price: 149.99 }],
        total: 149.99,
        status: 'pending',
        date: new Date().toISOString()
      };
      
      await twilioWhatsApp.default.sendOrderNotification(testOrder);
      auditLogger.log('TWILIO_TEST_SENT', { message: 'Twilio test notification sent' });
      alert('Twilio test notification sent successfully!');
    } catch (error) {
      console.error('Error sending Twilio test notification:', error);
      alert('Failed to send Twilio test notification. Please check the console for details.');
    }
  };

  const handleClearTwilio = () => {
    setTwilioConfig(null);
    localStorage.removeItem('twilioConfig');
    auditLogger.log('TWILIO_CLEARED', { message: 'Twilio configuration cleared' });
    alert('Twilio configuration cleared!');
  };

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const moroccoTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Casablanca',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(now);
      setMoroccoTime(moroccoTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load security stats
  useEffect(() => {
    const loadSecurityStats = () => {
      const logs = auditLogger.getRecentLogs(1000);
      const now = Date.now();
      const last24h = logs.filter(log => now - log.timestamp < 24 * 60 * 60 * 1000);
      const last7d = logs.filter(log => now - log.timestamp < 7 * 24 * 60 * 60 * 1000);

      setSecurityStats({
        totalLogs: logs.length,
        last24h: {
          loginSuccess: last24h.filter(log => log.event === 'LOGIN_SUCCESS').length,
          loginFailed: last24h.filter(log => log.event === 'LOGIN_FAILED').length,
          logout: last24h.filter(log => log.event === 'LOGOUT').length
        },
        last7d: {
          accountLocked: last7d.filter(log => log.event === 'ACCOUNT_LOCKED').length
        }
      });
    };

    loadSecurityStats();
    const interval = setInterval(loadSecurityStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-2xl p-10 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-blue-400 group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white bg-gradient-to-r from-blue-400 via-purple-300 to-pink-200 bg-clip-text text-transparent mb-2">
                Welcome Back, Admin
              </h1>
              <p className="text-gray-300 text-xl font-medium">Lost Clothing Brand Management Dashboard</p>
              <div className="flex items-center justify-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm font-medium">Real-time Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 text-sm font-medium">Secure Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                  <span className="text-green-400 text-sm font-bold animate-pulse">+{products.length}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-green-400 text-sm font-semibold mb-2 uppercase tracking-wide">Total Products</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                {products.length}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">Active in store</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                  <span className="text-blue-400 text-sm font-bold animate-pulse">📦</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-blue-400 text-sm font-semibold mb-2 uppercase tracking-wide">Total Orders</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {orders.length}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">All time orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                  <span className="text-purple-400 text-sm font-bold animate-pulse">📧</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-purple-400 text-sm font-semibold mb-2 uppercase tracking-wide">Newsletter Subscribers</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                {newsletterSubscribers.length}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">Active subscribers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/30 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500/30 to-pink-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-pink-400 group-hover:text-pink-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-pink-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30">
                  <span className="text-pink-400 text-sm font-bold animate-pulse">💰</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-pink-400 text-sm font-semibold mb-2 uppercase tracking-wide">Total Revenue</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-pink-300 transition-colors duration-300">
                ${orders.reduce((total, order) => total + parseFloat(order.total || 0), 0).toFixed(2)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">All time sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Add Product</p>
                <p className="text-gray-400 text-sm">Create new product</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">View Orders</p>
                <p className="text-gray-400 text-sm">Manage orders</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Notifications</p>
                <p className="text-gray-400 text-sm">Configure alerts</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleTestOrder()}
            className="p-6 bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500/30 to-pink-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Test Order</p>
                <p className="text-gray-400 text-sm">Create test order</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Recent Orders</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">Order #{order.id}</p>
                  <p className="text-gray-400 text-sm">{order.customerName} - {order.customerEmail}</p>
                  <p className="text-gray-500 text-xs">{new Date(order.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">${order.total}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'shipped' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Analytics */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Insights & Analytics</h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300">
              Last 7 Days
            </button>
            <button className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 rounded-lg transition-all duration-300">
              Last 30 Days
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Analytics */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Sales Analytics</span>
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Sales</span>
                <span className="text-green-400 font-bold">${orders.reduce((total, order) => total + parseFloat(order.total || 0), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average Order Value</span>
                <span className="text-blue-400 font-bold">
                  ${orders.length > 0 ? (orders.reduce((total, order) => total + parseFloat(order.total || 0), 0) / orders.length).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Orders This Week</span>
                <span className="text-purple-400 font-bold">
                  {orders.filter(order => {
                    const orderDate = new Date(order.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Conversion Rate</span>
                <span className="text-pink-400 font-bold">
                  {newsletterSubscribers.length > 0 ? ((orders.length / newsletterSubscribers.length) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
          </div>

          {/* Product Performance */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Product Performance</span>
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Products</span>
                <span className="text-green-400 font-bold">{products.filter(p => p.active !== false).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Low Stock Items</span>
                <span className="text-yellow-400 font-bold">
                  {products.filter(p => parseInt(p.stock) < 10).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Out of Stock</span>
                <span className="text-red-400 font-bold">
                  {products.filter(p => parseInt(p.stock) === 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average Price</span>
                <span className="text-purple-400 font-bold">
                  ${products.length > 0 ? (products.reduce((total, p) => total + parseFloat(p.price || 0), 0) / products.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="mt-8 bg-white/5 rounded-lg border border-white/10 p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Order Status Distribution</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-400 font-bold text-xl">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Pending</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-400 font-bold text-xl">
                  {orders.filter(o => o.status === 'processing').length}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Processing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-400 font-bold text-xl">
                  {orders.filter(o => o.status === 'shipped').length}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Shipped</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-400 font-bold text-xl">
                  {orders.filter(o => o.status === 'delivered').length}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Delivered</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-400 font-bold text-xl">
                  {orders.filter(o => o.status === 'cancelled').length}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/5 rounded-lg border border-white/10 p-6">
          <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Recent Activity</span>
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {auditLogger.getRecentLogs(10).map((log, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className={`w-3 h-3 rounded-full ${
                  log.event.includes('LOGIN') ? 'bg-green-500' :
                  log.event.includes('PRODUCT') ? 'bg-blue-500' :
                  log.event.includes('ORDER') ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{log.event.replace(/_/g, ' ')}</p>
                  <p className="text-gray-400 text-xs">{log.details.message}</p>
                </div>
                <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Recent Products</h3>
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition-all duration-300"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product, index) => (
            <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center space-x-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300" />
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-green-300 transition-colors duration-300">{product.name}</p>
                  <p className="text-green-400 font-bold">${product.price}</p>
                  <p className="text-gray-500 text-xs">Stock: {product.stock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-8">
      {/* Enhanced Products Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-600/10 to-green-700/10 border border-green-500/30 rounded-2xl p-10 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white bg-gradient-to-r from-green-400 via-green-300 to-green-200 bg-clip-text text-transparent mb-2">
                Products Management
              </h1>
              <p className="text-gray-300 text-xl font-medium">Manage your Lost Clothing Brand inventory</p>
              <div className="flex items-center justify-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">{products.length} Products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm font-medium">{products.filter(p => p.active !== false).length} Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 text-sm font-medium">{products.filter(p => parseInt(p.stock) < 10).length} Low Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Add New Product */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add New Product</span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setNewProduct({
                  name: '',
                  price: '',
                  description: '',
                  image: '',
                  stock: '',
                  sizes: {},
                  colors: [],
                  material: '',
                  care: ''
                });
              }}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 rounded-lg transition-all duration-300"
            >
              Clear Form
            </button>
          </div>
        </div>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Product Name *</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Stock Quantity *</label>
            <input
              type="number"
              min="0"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              placeholder="Enter stock quantity"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Material</label>
            <input
              type="text"
              value={newProduct.material}
              onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              placeholder="e.g., Cotton, Polyester, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-medium">Description *</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              placeholder="Enter detailed product description..."
              rows="3"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-medium">Care Instructions</label>
            <textarea
              value={newProduct.care}
              onChange={(e) => setNewProduct({ ...newProduct, care: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              placeholder="e.g., Machine wash cold, Tumble dry low..."
              rows="2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2 font-medium">Product Image *</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-green-500 transition-colors duration-300">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, false)}
                className="hidden"
                accept="image/*"
                id="product-image"
                required
              />
              <label htmlFor="product-image" className="cursor-pointer">
                {newProduct.image ? (
                  <div className="space-y-4">
                    <img src={newProduct.image} alt="Preview" className="mx-auto w-32 h-32 object-cover rounded-lg border border-gray-600" />
                    <p className="text-green-400 text-sm">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-400">Click to upload product image</p>
                    <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-green-400 border border-green-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 font-semibold"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Product</span>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Enhanced Products List */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Products Inventory</span>
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-white font-bold text-xl">{products.length}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-green-400 font-bold text-xl">{products.filter(p => p.active !== false).length}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Low Stock</p>
              <p className="text-yellow-400 font-bold text-xl">{products.filter(p => parseInt(p.stock) < 10).length}</p>
            </div>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400">Start by adding your first product above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="relative mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parseInt(product.stock) === 0 ? 'bg-red-500/20 text-red-400' :
                      parseInt(product.stock) < 10 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {parseInt(product.stock) === 0 ? 'Out of Stock' :
                       parseInt(product.stock) < 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-green-300 transition-colors duration-300">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-400 font-bold text-lg">${product.price}</span>
                  <span className={`text-sm font-medium ${
                    parseInt(product.stock) === 0 ? 'text-red-400' :
                    parseInt(product.stock) < 10 ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    Stock: {product.stock}
                  </span>
                </div>
                {product.material && (
                  <p className="text-gray-500 text-xs mb-3">Material: {product.material}</p>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Product</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Material</label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description *</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Care Instructions</label>
                <textarea
                  value={editingProduct.care}
                  onChange={(e) => setEditingProduct({ ...editingProduct, care: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Product Image</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-300">
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    accept="image/*"
                    id="edit-product-image"
                  />
                  <label htmlFor="edit-product-image" className="cursor-pointer">
                    {editingProduct.image ? (
                      <div className="space-y-4">
                        <img src={editingProduct.image} alt="Preview" className="mx-auto w-32 h-32 object-cover rounded-lg border border-gray-600" />
                        <p className="text-blue-400 text-sm">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-400">Click to upload new image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Product</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      {/* Orders Header */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Orders Management</h2>
            <p className="text-gray-300">Manage customer orders and track their status</p>
          </div>
          <button
            onClick={handleTestOrder}
            className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl transition-all duration-300"
          >
            Create Test Order
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <h3 className="text-2xl font-bold text-white mb-6">All Orders</h3>
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-bold text-lg">Order #{order.id}</h4>
                  <p className="text-gray-400 text-sm">{new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-xl">${order.total}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="mt-2 px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h5 className="text-white font-semibold mb-2">Customer Information</h5>
                  <p className="text-gray-300 text-sm">Name: {order.customerName}</p>
                  <p className="text-gray-300 text-sm">Email: {order.customerEmail}</p>
                  {order.customerPhone && (
                    <p className="text-gray-300 text-sm">Phone: {order.customerPhone}</p>
                  )}
                </div>
                <div>
                  <h5 className="text-white font-semibold mb-2">Order Items</h5>
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name} x{item.quantity}</span>
                      <span className="text-gray-400">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'shipped' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'delivered' ? 'bg-green-600/20 text-green-300' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {order.status.toUpperCase()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/${order.customerPhone?.replace(/\D/g, '')}?text=Hi ${order.customerName}, regarding your order #${order.id}...`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition-all duration-300"
                    disabled={!order.customerPhone}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      const emailUrl = `mailto:${order.customerEmail}?subject=Order #${order.id} Update&body=Hi ${order.customerName}, regarding your order...`;
                      window.open(emailUrl);
                    }}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8">
      {/* Enhanced Notifications Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-600/10 to-purple-700/10 border border-purple-500/30 rounded-2xl p-10 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19zM12 2v4M6 2v4" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent mb-2">
                Notifications Center
              </h1>
              <p className="text-gray-300 text-xl font-medium">Stay connected with your customers</p>
              <div className="flex items-center justify-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${whatsappEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${whatsappEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    WhatsApp {whatsappEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${twilioConfig ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                  <span className={`text-sm font-medium ${twilioConfig ? 'text-blue-400' : 'text-gray-400'}`}>
                    Twilio {twilioConfig ? 'Configured' : 'Not Setup'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Quick Setup Guide</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 font-bold">1</span>
              </div>
              <h3 className="text-white font-semibold">Enable WhatsApp</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Start by enabling WhatsApp notifications to receive order alerts</p>
            <button
              onClick={handleEnableNotifications}
              className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition-all duration-300"
            >
              Enable WhatsApp
            </button>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h3 className="text-white font-semibold">Configure Twilio</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Set up Twilio API for automatic WhatsApp messaging</p>
            <button
              onClick={handleConfigureTwilio}
              className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300"
            >
              Setup Twilio
            </button>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <h3 className="text-white font-semibold">Test System</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Create a test order to verify notifications work properly</p>
            <button
              onClick={handleTestOrder}
              className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg transition-all duration-300"
            >
              Test Notifications
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Notifications Status */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>WhatsApp Notifications</span>
          </h2>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              whatsappEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {whatsappEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">How it works</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>When a new order is placed, you'll receive a WhatsApp notification</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Notifications include customer details, order items, and total amount</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Click the notification to open WhatsApp and respond to customers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Controls</h3>
            <div className="space-y-3">
              <button
                onClick={handleEnableNotifications}
                disabled={whatsappEnabled}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                  whatsappEnabled 
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Enable Notifications</span>
                </div>
              </button>
              <button
                onClick={handleDisableNotifications}
                disabled={!whatsappEnabled}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                  !whatsappEnabled 
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Disable Notifications</span>
                </div>
              </button>
              <button
                onClick={handleTestNotification}
                className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Send Test Notification</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Twilio API Configuration */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Twilio API Configuration</span>
          </h2>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              twilioConfig ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {twilioConfig ? 'Configured' : 'Not Setup'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Setup Instructions</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Create a Twilio account at <a href="https://twilio.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">twilio.com</a></p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Get your Account SID and Auth Token from the Twilio Console</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Set up a WhatsApp number in your Twilio account</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Click "Configure" below to enter your credentials</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Configuration</h3>
            <div className="space-y-3">
              <button
                onClick={handleConfigureTwilio}
                className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Configure Twilio</span>
                </div>
              </button>
              <button
                onClick={handleTestTwilio}
                disabled={!twilioConfig}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                  !twilioConfig 
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Test Twilio</span>
                </div>
              </button>
              <button
                onClick={handleClearTwilio}
                disabled={!twilioConfig}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                  !twilioConfig 
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Configuration</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test & Demo Section */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Test & Demo</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Test Order Creation</h3>
            <p className="text-gray-400 text-sm mb-4">Create a test order to see how notifications work in action</p>
            <button
              onClick={handleTestOrder}
              className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Test Order</span>
              </div>
            </button>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Notification Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">WhatsApp Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  whatsappEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {whatsappEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Twilio Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  twilioConfig ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {twilioConfig ? 'Configured' : 'Not Setup'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Test</span>
                <span className="text-gray-400 text-xs">Never</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help & Support</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Common Issues</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Notifications not working?</strong> Make sure WhatsApp is enabled and Twilio is configured</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Twilio errors?</strong> Check your Account SID, Auth Token, and WhatsApp number format</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Test notifications?</strong> Use the "Send Test Notification" button to verify setup</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <a 
                href="https://twilio.com/docs/whatsapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Twilio WhatsApp Documentation</span>
              </a>
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>WhatsApp Web</span>
              </a>
              <a 
                href="https://twilio.com/console" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Twilio Console</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      {/* Enhanced Security Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 via-red-600/10 to-red-700/10 border border-red-500/30 rounded-2xl p-10 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white bg-gradient-to-r from-red-400 via-red-300 to-red-200 bg-clip-text text-transparent mb-2">
                Security Center
              </h1>
              <p className="text-gray-300 text-xl font-medium">Advanced Security Management & Monitoring</p>
              <div className="flex items-center justify-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">System Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm font-medium">Real-time Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 text-sm font-medium">Audit Logging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                  <span className="text-green-400 text-sm font-bold animate-pulse">+{securityStats?.last24h?.loginSuccess || 0}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-green-400 text-sm font-semibold mb-2 uppercase tracking-wide">Successful Logins</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                {securityStats?.last24h?.loginSuccess || 0}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">Last 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-red-400 group-hover:text-red-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
                  <span className="text-red-400 text-sm font-bold animate-pulse">⚠️</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-red-400 text-sm font-semibold mb-2 uppercase tracking-wide">Failed Attempts</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-red-300 transition-colors duration-300">
                {securityStats?.last24h?.loginFailed || 0}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">Last 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                  <span className="text-yellow-400 text-sm font-bold animate-pulse">🔒</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-yellow-400 text-sm font-semibold mb-2 uppercase tracking-wide">Account Lockouts</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                {securityStats?.last7d?.accountLocked || 0}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">Last 7 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div className="text-right">
                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                  <span className="text-blue-400 text-sm font-bold animate-pulse">📊</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-blue-400 text-sm font-semibold mb-2 uppercase tracking-wide">Total Logs</p>
              <p className="text-4xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {securityStats?.totalLogs || 0}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-sm font-medium">All time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Recent Security Events</h3>
          <button
            onClick={() => {
              const logs = auditLogger.exportLogs();
              const blob = new Blob([logs], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'security-logs.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-300"
          >
            Export Logs
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {auditLogger.getRecentLogs(20).map((log, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className={`w-4 h-4 rounded-full ${
                log.event === 'LOGIN_SUCCESS' ? 'bg-green-500' :
                log.event === 'LOGIN_FAILED' ? 'bg-red-500' :
                log.event === 'LOGOUT' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-white font-medium">{log.event.replace(/_/g, ' ')}</p>
                <p className="text-gray-400 text-sm">{log.details.message}</p>
                <p className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-8">
              <img src={logo} alt="Lost Brand" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Lost Clothing Brand Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-white font-mono">{moroccoTime}</div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'products', label: 'Products', icon: '🛍️' },
            { id: 'orders', label: 'Orders', icon: '📦' },
            { id: 'notifications', label: 'Notifications', icon: '📱' },
            { id: 'security', label: 'Security', icon: '🔒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'security') {
                  handleSecurityTabClick();
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'notifications' && renderNotifications()}
      </div>

      {/* Security PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">Security PIN Required</h3>
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Enter 6-digit PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter PIN"
                  maxLength={6}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 