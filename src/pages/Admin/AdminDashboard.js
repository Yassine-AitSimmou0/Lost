import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import authService from '../../utils/auth';
import auditLogger from '../../utils/auditLogger';
import logo from '../../Assets/Images/Mwader.png';
import whatsAppNotifier from '../../utils/whatsappNotifications';
import twilioWhatsApp from '../../utils/twilioWhatsApp';

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
    addOrder,
    getAnalytics 
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationPhone, setNotificationPhone] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: '',
    authToken: '',
    fromNumber: '',
    toNumber: ''
  });
  const [twilioEnabled, setTwilioEnabled] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Hoodies',
    tag: 'Limited Edition',
    image: '',
    sizes: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0
    },
    colors: ['Black'],
    material: '',
    care: ''
  });
  const [moroccoTime, setMoroccoTime] = useState('');
  const [securityStats, setSecurityStats] = useState(null);
  const [securityPin, setSecurityPin] = useState('');
  const [showSecurityPinModal, setShowSecurityPinModal] = useState(false);
  const [securityAccessGranted, setSecurityAccessGranted] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 30,
    jwtExpiry: 24,
    enableAuditLogging: true,
    enableRateLimiting: true,
    enableAccountLockout: true,
    enableSessionTimeout: true
  });

  useEffect(() => {
    // Check if admin is logged in with valid token
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token || !(await authService.validateSession(token))) {
        navigate('/admin/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      authService.logout(token);
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

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
        sizes: {
          ...editingProduct.sizes,
          [size]: parseInt(value) || 0
        }
      });
    } else {
      setNewProduct({
        ...newProduct,
        sizes: {
          ...newProduct.sizes,
          [size]: parseInt(value) || 0
        }
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      sizes: product.sizes || { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
    });
    setShowEditProduct(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      stock: parseInt(editingProduct.stock)
    });
    setShowEditProduct(false);
    setEditingProduct(null);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock)
    });
    setNewProduct({ 
      name: '', 
      description: '', 
      price: '', 
      stock: '', 
      category: 'Hoodies', 
      tag: 'Limited Edition',
      image: '',
      sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
      colors: ['Black'],
      material: '',
      care: ''
    });
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Removed unused handleUpdateStock function

  const handleUpdateOrderStatus = (id, status) => {
    updateOrderStatus(id, status);
  };

  // WhatsApp Notification Functions
  const handleEnableNotifications = async () => {
    if (notificationPhone.trim()) {
      // Request browser notification permission first
      const browserPermission = await whatsAppNotifier.requestNotificationPermission();
      
      whatsAppNotifier.initialize(notificationPhone);
      setNotificationsEnabled(true);
      localStorage.setItem('whatsappNotifications', 'true');
      localStorage.setItem('whatsappPhone', notificationPhone);
      
      if (browserPermission) {
        alert('Notifications enabled! You will receive both browser and WhatsApp notifications for new orders.');
      } else {
        alert('WhatsApp notifications enabled! You will receive WhatsApp notifications for new orders.');
      }
    } else {
      alert('Please enter a valid phone number');
    }
  };

  const handleDisableNotifications = () => {
    whatsAppNotifier.disable();
    setNotificationsEnabled(false);
    setNotificationPhone('');
    localStorage.removeItem('whatsappNotifications');
    localStorage.removeItem('whatsappPhone');
    alert('WhatsApp notifications disabled');
  };
  
  const handleTestNotification = async () => {
    if (notificationsEnabled) {
      await whatsAppNotifier.sendTestNotification();
    } else {
      alert('Please enable notifications first');
    }
  };

  const handleTestOrder = () => {
    const testOrder = {
      customer: 'Test Customer',
      total: 149.99,
      status: 'pending',
      items: [1, 2], // Product IDs
      shippingAddress: '123 Test Street, Test City, TC 12345',
      customerEmail: 'test@example.com'
    };
    
    addOrder(testOrder);
    alert('Test order created! Check your WhatsApp if notifications are enabled.');
  };

  // Twilio WhatsApp API Functions
  const handleConfigureTwilio = () => {
    if (twilioConfig.accountSid && twilioConfig.authToken && twilioConfig.fromNumber && twilioConfig.toNumber) {
      twilioWhatsApp.configure(
        twilioConfig.accountSid,
        twilioConfig.authToken,
        twilioConfig.fromNumber,
        twilioConfig.toNumber
      );
      setTwilioEnabled(true);
      alert('Twilio WhatsApp API configured successfully! Messages will be sent automatically.');
    } else {
      alert('Please fill in all Twilio configuration fields.');
    }
  };

  const handleTestTwilio = async () => {
    if (!twilioEnabled) {
      alert('Please configure Twilio API first.');
      return;
    }

    try {
      const result = await twilioWhatsApp.testConnection();
      if (result.success) {
        alert('Test message sent successfully! Check your WhatsApp.');
      } else {
        alert(`Test failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Error testing Twilio: ${error.message}`);
    }
  };

  const handleClearTwilio = () => {
    twilioWhatsApp.clearConfiguration();
    setTwilioEnabled(false);
    setTwilioConfig({
      accountSid: '',
      authToken: '',
      fromNumber: '',
      toNumber: ''
    });
    alert('Twilio configuration cleared');
  };

  // Security PIN Functions
  const handleSecurityTabClick = () => {
    if (!securityAccessGranted) {
      setShowSecurityPinModal(true);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Default PIN: 123456 (you can change this)
    if (securityPin === '123456') {
      setSecurityAccessGranted(true);
      setShowSecurityPinModal(false);
      setSecurityPin('');
      setActiveTab('security');
    } else {
      alert('Invalid PIN. Please try again.');
      setSecurityPin('');
    }
  };

  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSecuritySettings = () => {
    // Save settings to localStorage
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    alert('Security settings saved successfully!');
  };

  const handleResetSecuritySettings = () => {
    const defaultSettings = {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      sessionTimeout: 30,
      jwtExpiry: 24,
      enableAuditLogging: true,
      enableRateLimiting: true,
      enableAccountLockout: true,
      enableSessionTimeout: true
    };
    setSecuritySettings(defaultSettings);
    localStorage.setItem('securitySettings', JSON.stringify(defaultSettings));
    alert('Security settings reset to defaults!');
  };

  // Load notification settings on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('whatsappNotifications');
    const savedPhone = localStorage.getItem('whatsappPhone');
    
    if (savedNotifications === 'true' && savedPhone) {
      setNotificationsEnabled(true);
      setNotificationPhone(savedPhone);
      whatsAppNotifier.initialize(savedPhone);
    }

    // Load Twilio configuration
    const twilioLoaded = twilioWhatsApp.loadConfiguration();
    if (twilioLoaded) {
      setTwilioEnabled(true);
      const status = twilioWhatsApp.getStatus();
      setTwilioConfig({
        accountSid: status.accountSid || '',
        authToken: '', // Don't load auth token for security
        fromNumber: status.fromNumber || '',
        toNumber: status.toNumber || ''
      });
    }
  }, []);

  // Get analytics from context
  const analytics = getAnalytics();

  useEffect(() => {
    // Update Morocco time every second
    const updateTime = () => {
      const now = new Date();
      // Add 1 hour to current time
      now.setHours(now.getHours() + 1);
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setMoroccoTime(now.toLocaleTimeString('en-GB', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load security statistics
  useEffect(() => {
    const loadSecurityStats = () => {
      const stats = auditLogger.getSecurityStats();
      setSecurityStats(stats);
    };

    loadSecurityStats();
    const interval = setInterval(loadSecurityStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Load security settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setSecuritySettings(settings);
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    }
  }, []);

  const renderOverview = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 group animate-slideInLeft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-400 text-sm font-medium animate-pulse">+12.5%</span>
            </div>
          </div>
          <div>
            <p className="text-green-400 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">${analytics.totalRevenue.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">This month</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group animate-slideInLeft" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-blue-400 text-sm font-medium animate-pulse">+8.3%</span>
            </div>
          </div>
          <div>
            <p className="text-blue-400 text-sm font-medium mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{analytics.totalOrders}</p>
            <p className="text-gray-500 text-xs">Last 30 days</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group animate-slideInLeft" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-purple-400 text-sm font-medium animate-pulse">+2</span>
            </div>
          </div>
          <div>
            <p className="text-purple-400 text-sm font-medium mb-1">Active Products</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">{analytics.totalProducts}</p>
            <p className="text-gray-500 text-xs">In inventory</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group animate-slideInLeft" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-red-400 text-sm font-medium animate-pulse">!</span>
            </div>
          </div>
          <div>
            <p className="text-red-400 text-sm font-medium mb-1">Low Stock Alert</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">{analytics.lowStockProducts}</p>
            <p className="text-gray-500 text-xs">Need attention</p>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-slideInRight">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Sales Overview</h3>
            <select className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="space-y-4">
            {[
              { day: 'Mon', sales: 1200, percentage: 85 },
              { day: 'Tue', sales: 1800, percentage: 95 },
              { day: 'Wed', sales: 1400, percentage: 75 },
              { day: 'Thu', sales: 2200, percentage: 100 },
              { day: 'Fri', sales: 1600, percentage: 80 },
              { day: 'Sat', sales: 2400, percentage: 100 },
              { day: 'Sun', sales: 1900, percentage: 90 }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 group/item hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <span className="text-gray-400 text-sm w-8 group-hover/item:text-white transition-colors duration-300">{item.day}</span>
                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out transform origin-left"
                    style={{ 
                      width: `${item.percentage}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
                <span className="text-white text-sm font-medium group-hover/item:text-blue-300 transition-colors duration-300">${item.sales}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-slideInRight" style={{animationDelay: '0.2s'}}>
          <h3 className="text-xl font-bold text-white mb-6">Top Performing Products</h3>
          <div className="space-y-4">
            {products
              .sort((a, b) => (b.sales || 0) - (a.sales || 0))
              .slice(0, 5)
              .map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group/item">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium group-hover/item:text-purple-300 transition-colors duration-300">{product.name}</p>
                    <p className="text-gray-400 text-sm group-hover/item:text-gray-300 transition-colors duration-300">{product.sales || 0} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold group-hover/item:text-purple-300 transition-colors duration-300">${product.price}</p>
                    <p className="text-gray-400 text-xs group-hover/item:text-gray-300 transition-colors duration-300">{product.stock} in stock</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Order Value */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-slideInRight" style={{animationDelay: '0.4s'}}>
                      <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm group-hover:text-yellow-400 transition-colors duration-300">Avg Order Value</p>
                <p className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">${analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00'}</p>
              </div>
            </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-slideInRight" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm group-hover:text-green-400 transition-colors duration-300">Conversion Rate</p>
              <p className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">3.2%</p>
            </div>
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-slideInRight" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm group-hover:text-pink-400 transition-colors duration-300">Newsletter Subs</p>
              <p className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors duration-300">{analytics.totalSubscribers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-fadeIn" style={{animationDelay: '0.7s'}}>
                  <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white border border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View All</span>
              </div>
            </button>
          </div>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, index) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group/item" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">#{order.id}</span>
                </div>
                <div>
                  <p className="text-white font-medium group-hover/item:text-blue-300 transition-colors duration-300">{order.customer}</p>
                  <p className="text-gray-400 text-sm group-hover/item:text-gray-300 transition-colors duration-300">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white font-bold text-lg group-hover/item:text-blue-300 transition-colors duration-300">${order.total}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 border group-hover/item:scale-105 ${
                    order.status === 'completed' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30' :
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Product Management</h2>
        <button
          onClick={() => setShowAddProduct(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-green-400 border border-green-500/30 hover:border-green-500/50 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add New Product</span>
          </div>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl h-full flex flex-col group animate-slideInLeft" style={{animationDelay: `${index * 0.1}s`}}>
            {/* Product Image */}
            <div className="relative mb-4 flex-shrink-0">
              <img
                src={product.image || logo}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full group-hover:bg-white/30 transition-all duration-300">
                  {product.tag}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="text-lg font-bold text-white mb-2 flex-shrink-0">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-shrink-0">{product.description}</p>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">${product.price?.toFixed(2) || '0.00'}</span>
                    <span className="text-gray-400 text-sm">{product.stock || 0} in stock</span>
                  </div>

                  {/* Sizes */}
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Available Sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(product.sizes || {}).map(([size, count]) => (
                        count > 0 && (
                          <span key={size} className="px-2 py-1 bg-white/10 text-white text-xs rounded">
                            {size}: {count}
                          </span>
                        )
                      ))}
                      {(!product.sizes || Object.values(product.sizes || {}).every(count => count === 0)) && (
                        <span className="text-gray-500 text-xs">No sizes available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 mt-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 border border-blue-500/30 hover:border-blue-500/50"
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
                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 text-sm transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border border-red-500/30 hover:border-red-500/50"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </div>
                  </button>
                  <select
                    value={product.status}
                    onChange={(e) => updateProduct(product.id, { status: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-300 hover:border-white/40"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Order Management</h2>
      
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors duration-300">
                  <td className="px-6 py-4 text-white font-medium">#{order.id}</td>
                  <td className="px-6 py-4 text-white">{order.customer}</td>
                  <td className="px-6 py-4 text-white font-bold">${order.total}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                        'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{order.date}</td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">WhatsApp Notifications</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual WhatsApp Settings */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Manual WhatsApp</h3>
                <p className="text-gray-400">Pre-filled messages (requires manual send)</p>
              </div>
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                value={notificationPhone}
                onChange={(e) => setNotificationPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                disabled={notificationsEnabled}
              />
              <p className="text-gray-500 text-sm mt-1">Enter your WhatsApp number with country code</p>
            </div>

            <div className="flex space-x-3">
              {!notificationsEnabled ? (
                <button
                  onClick={handleEnableNotifications}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Enable Notifications
                </button>
              ) : (
                <button
                  onClick={handleDisableNotifications}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Disable Notifications
                </button>
              )}
              
              <button
                onClick={handleTestNotification}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Test Notification
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleTestOrder}
                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Create Test Order
              </button>
            </div>

            {notificationsEnabled && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400 font-medium">Notifications enabled for {notificationPhone}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Twilio WhatsApp API Settings */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Automatic WhatsApp API</h3>
              <p className="text-gray-400">Truly automatic messages (requires Twilio setup)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Account SID</label>
              <input
                type="text"
                value={twilioConfig.accountSid}
                onChange={(e) => setTwilioConfig({...twilioConfig, accountSid: e.target.value})}
                placeholder="AC1234567890abcdef..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                disabled={twilioEnabled}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Auth Token</label>
              <input
                type="password"
                value={twilioConfig.authToken}
                onChange={(e) => setTwilioConfig({...twilioConfig, authToken: e.target.value})}
                placeholder="Your Twilio Auth Token"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                disabled={twilioEnabled}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">From Number (WhatsApp)</label>
              <input
                type="text"
                value={twilioConfig.fromNumber}
                onChange={(e) => setTwilioConfig({...twilioConfig, fromNumber: e.target.value})}
                placeholder="whatsapp:+14155238886"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                disabled={twilioEnabled}
              />
              <p className="text-gray-500 text-sm mt-1">Use format: whatsapp:+14155238886</p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">To Number (Your WhatsApp)</label>
              <input
                type="text"
                value={twilioConfig.toNumber}
                onChange={(e) => setTwilioConfig({...twilioConfig, toNumber: e.target.value})}
                placeholder="whatsapp:+1234567890"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                disabled={twilioEnabled}
              />
              <p className="text-gray-500 text-sm mt-1">Use format: whatsapp:+1234567890 (your number)</p>
            </div>

            <div className="flex space-x-3">
              {!twilioEnabled ? (
                <button
                  onClick={handleConfigureTwilio}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Configure Twilio API
                </button>
              ) : (
                <button
                  onClick={handleClearTwilio}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Clear Configuration
                </button>
              )}
              
              <button
                onClick={handleTestTwilio}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Test API
              </button>
            </div>

            {twilioEnabled && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-400 font-medium">Twilio API configured - Messages will be sent automatically!</span>
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">📋 Setup Instructions:</h4>
              <ol className="text-gray-300 text-sm space-y-2">
                <li>1. Go to <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twilio Console</a></li>
                <li>2. Navigate to Messaging → Try it out → Send a WhatsApp message</li>
                <li>3. Copy your unique sandbox code (e.g., "abc123")</li>
                <li>4. Open WhatsApp and send "join abc123" to +14155238886</li>
                <li>5. Wait for confirmation message</li>
                <li>6. Use the exact formats shown in the input fields above</li>
                <li>7. Test the connection with "Test API" button</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Info */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">How It Works</h3>
              <p className="text-gray-400">Learn about WhatsApp notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium">New Order Received</p>
                <p className="text-gray-400 text-sm">When a customer places an order on your website</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium">WhatsApp Message</p>
                <p className="text-gray-400 text-sm">You'll receive a detailed message with order information</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Instant Action</p>
                <p className="text-gray-400 text-sm">Process the order immediately from your phone</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">What You'll Receive:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Order ID and customer details</li>
                <li>• Total amount and items ordered</li>
                <li>• Shipping address information</li>
                <li>• Customer contact details</li>
                <li>• Order timestamp</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">💡 For True Automation:</h4>
              <p className="text-gray-300 text-sm mb-2">
                For completely automatic WhatsApp messages (no manual clicking), you can:
              </p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use WhatsApp Business API (requires approval)</li>
                <li>• Integrate with Twilio WhatsApp API</li>
                <li>• Use services like MessageBird or Vonage</li>
                <li>• Set up webhook integrations</li>
              </ul>
              <p className="text-gray-400 text-xs mt-2">
                Current solution opens WhatsApp with pre-filled message for quick sending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Security Header */}
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-8 text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white bg-gradient-to-r from-red-400 via-red-300 to-red-200 bg-clip-text text-transparent">
              Security Center
            </h1>
            <p className="text-gray-400 text-lg">Advanced Security Management & Monitoring</p>
          </div>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-green-400 text-sm font-medium animate-pulse">+{securityStats?.last24h?.loginSuccess || 0}</span>
            </div>
          </div>
          <div>
            <p className="text-green-400 text-sm font-medium mb-1">Successful Logins</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
              {securityStats?.last24h?.loginSuccess || 0}
            </p>
            <p className="text-gray-500 text-xs">Last 24 hours</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-red-400 text-sm font-medium animate-pulse">⚠️</span>
            </div>
          </div>
          <div>
            <p className="text-red-400 text-sm font-medium mb-1">Failed Attempts</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">
              {securityStats?.last24h?.loginFailed || 0}
            </p>
            <p className="text-gray-500 text-xs">Last 24 hours</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-yellow-400 text-sm font-medium animate-pulse">🔒</span>
            </div>
          </div>
          <div>
            <p className="text-yellow-400 text-sm font-medium mb-1">Account Lockouts</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
              {securityStats?.last7d?.accountLocked || 0}
            </p>
            <p className="text-gray-500 text-xs">Last 7 days</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-blue-400 text-sm font-medium animate-pulse">📊</span>
            </div>
          </div>
          <div>
            <p className="text-blue-400 text-sm font-medium mb-1">Total Logs</p>
            <p className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
              {securityStats?.totalLogs || 0}
            </p>
            <p className="text-gray-500 text-xs">All time</p>
          </div>
        </div>
      </div>

      {/* Editable Security Settings */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8 hover:border-gray-700 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Security Configuration</h3>
            <p className="text-gray-400">Customize your security settings and preferences</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSaveSecuritySettings}
              className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Settings</span>
              </div>
            </button>
            <button
              onClick={handleResetSecuritySettings}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Settings */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center space-x-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Authentication Settings</span>
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <label className="text-white font-semibold">Max Login Attempts</label>
                  <p className="text-gray-400 text-sm">Number of failed attempts before lockout</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-mono focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <label className="text-white font-semibold">Lockout Duration (minutes)</label>
                  <p className="text-gray-400 text-sm">Time account remains locked after max attempts</p>
                </div>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={securitySettings.lockoutDuration}
                  onChange={(e) => handleSecuritySettingChange('lockoutDuration', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-mono focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <label className="text-white font-semibold">Session Timeout (minutes)</label>
                  <p className="text-gray-400 text-sm">Inactive session timeout duration</p>
                </div>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-mono focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <label className="text-white font-semibold">JWT Expiry (hours)</label>
                  <p className="text-gray-400 text-sm">Token expiration time</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={securitySettings.jwtExpiry}
                  onChange={(e) => handleSecuritySettingChange('jwtExpiry', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-mono focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Security Features</span>
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    securitySettings.enableAuditLogging 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-transparent border-gray-500'
                  }`}></div>
                  <div>
                    <label className="text-white font-semibold">Audit Logging</label>
                    <p className="text-gray-400 text-sm">Track all security events and activities</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecuritySettingChange('enableAuditLogging', !securitySettings.enableAuditLogging)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    securitySettings.enableAuditLogging
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {securitySettings.enableAuditLogging ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    securitySettings.enableRateLimiting 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-transparent border-gray-500'
                  }`}></div>
                  <div>
                    <label className="text-white font-semibold">Rate Limiting</label>
                    <p className="text-gray-400 text-sm">Prevent brute force attacks</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecuritySettingChange('enableRateLimiting', !securitySettings.enableRateLimiting)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    securitySettings.enableRateLimiting
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {securitySettings.enableRateLimiting ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    securitySettings.enableAccountLockout 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-transparent border-gray-500'
                  }`}></div>
                  <div>
                    <label className="text-white font-semibold">Account Lockout</label>
                    <p className="text-gray-400 text-sm">Temporarily lock accounts after failed attempts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecuritySettingChange('enableAccountLockout', !securitySettings.enableAccountLockout)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    securitySettings.enableAccountLockout
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {securitySettings.enableAccountLockout ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    securitySettings.enableSessionTimeout 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-transparent border-gray-500'
                  }`}></div>
                  <div>
                    <label className="text-white font-semibold">Session Timeout</label>
                    <p className="text-gray-400 text-sm">Automatically logout inactive sessions</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecuritySettingChange('enableSessionTimeout', !securitySettings.enableSessionTimeout)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    securitySettings.enableSessionTimeout
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {securitySettings.enableSessionTimeout ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8 hover:border-gray-700 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Recent Security Events</h3>
            <p className="text-gray-400">Monitor real-time security activities and alerts</p>
          </div>
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
            className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Logs</span>
            </div>
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {auditLogger.getRecentLogs(20).map((log, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className={`w-4 h-4 rounded-full ${
                log.event === 'LOGIN_SUCCESS' ? 'bg-green-500' :
                log.event === 'LOGIN_FAILED' ? 'bg-red-500' :
                log.event === 'LOGOUT' ? 'bg-yellow-500' :
                log.event === 'ACCOUNT_LOCKED' ? 'bg-red-600' :
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Left Side - Logo and Brand */}
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <img src={logo} alt="Lost Brand" className="h-12 w-auto animate-pulse group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black text-white bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-sm font-medium">Lost Clothing Brand Management</p>
              </div>
            </div>

            {/* Right Side - User Info and Actions */}
            <div className="flex items-center space-x-8">
              {/* Time Display */}
              <div className="hidden lg:block">
                <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl px-4 py-2 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group">
                  <span className="text-xl font-mono font-bold text-blue-300 drop-shadow-lg animate-glow group-hover:text-blue-200 transition-colors duration-300">
                    {moroccoTime}
                  </span>
                  <div className="absolute inset-0 rounded-xl blur-md opacity-30 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-pink-500/20 animate-pulse"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-semibold">Welcome, Admin</span>
                    <p className="text-gray-400 text-xs">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-semibold">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/10 shadow-2xl">
          {[
            { id: 'overview', label: 'Overview', icon: '📊', color: 'from-blue-500/20 to-blue-600/20' },
            { id: 'products', label: 'Products', icon: '🛍️', color: 'from-purple-500/20 to-purple-600/20' },
            { id: 'orders', label: 'Orders', icon: '📦', color: 'from-green-500/20 to-green-600/20' },
            { id: 'notifications', label: 'Notifications', icon: '📱', color: 'from-pink-500/20 to-pink-600/20' },
            { id: 'security', label: 'Security', icon: '🔒', color: 'from-red-500/20 to-red-600/20' }
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
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 relative overflow-hidden group ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl border border-white/20`
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tab.icon}</span>
                <span className="font-bold">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'security' && renderSecurity()}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Product</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="Pants">Pants</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                  rows="3"
                  required
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Total Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Tag</label>
                  <input
                    type="text"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({...newProduct, tag: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="Limited Edition"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-semibold mb-2">Product Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-all duration-300">
                  {newProduct.image ? (
                    <div className="space-y-4">
                      <img src={newProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                      <button
                        type="button"
                        onClick={() => setNewProduct({...newProduct, image: ''})}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <svg className="w-12 h-12 text-white/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-white">Click to upload product image</p>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-white font-semibold mb-2">Size Availability</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.keys(newProduct.sizes).map(size => (
                    <div key={size}>
                      <label className="block text-gray-400 text-sm mb-1">{size}</label>
                      <input
                        type="number"
                        value={newProduct.sizes[size]}
                        onChange={(e) => handleSizeChange(size, e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center transition-all duration-300 focus:outline-none focus:border-white/40"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Material</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="e.g., 100% Cotton"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Care Instructions</label>
                  <input
                    type="text"
                    value={newProduct.care}
                    onChange={(e) => setNewProduct({...newProduct, care: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="e.g., Machine wash cold"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Product</h3>
              <button
                onClick={() => setShowEditProduct(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all duration-300"
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="Pants">Pants</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                  rows="3"
                  required
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Total Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Tag</label>
                  <input
                    type="text"
                    value={editingProduct.tag}
                    onChange={(e) => setEditingProduct({...editingProduct, tag: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="Limited Edition"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-semibold mb-2">Product Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-all duration-300">
                  {editingProduct.image ? (
                    <div className="space-y-4">
                      <img src={editingProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                      <button
                        type="button"
                        onClick={() => setEditingProduct({...editingProduct, image: ''})}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <svg className="w-12 h-12 text-white/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-white">Click to upload product image</p>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-white font-semibold mb-2">Size Availability</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.keys(editingProduct.sizes).map(size => (
                    <div key={size}>
                      <label className="block text-gray-400 text-sm mb-1">{size}</label>
                      <input
                        type="number"
                        value={editingProduct.sizes[size]}
                        onChange={(e) => handleSizeChange(size, e.target.value, true)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center transition-all duration-300 focus:outline-none focus:border-white/40"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Material</label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({...editingProduct, material: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="e.g., 100% Cotton"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Care Instructions</label>
                  <input
                    type="text"
                    value={editingProduct.care}
                    onChange={(e) => setEditingProduct({...editingProduct, care: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
                    placeholder="e.g., Machine wash cold"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProduct(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Dashboard */}
      {activeTab === 'security' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Security Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-green-400 text-sm font-medium mb-1">Successful Logins</p>
                <p className="text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                  {securityStats?.last24h?.loginSuccess || 0}
                </p>
                <p className="text-gray-500 text-xs">Last 24 hours</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-red-400 text-sm font-medium mb-1">Failed Attempts</p>
                <p className="text-3xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">
                  {securityStats?.last24h?.loginFailed || 0}
                </p>
                <p className="text-gray-500 text-xs">Last 24 hours</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-yellow-400 text-sm font-medium mb-1">Account Lockouts</p>
                <p className="text-3xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {securityStats?.last7d?.accountLocked || 0}
                </p>
                <p className="text-gray-500 text-xs">Last 7 days</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-blue-400 text-sm font-medium mb-1">Total Logs</p>
                <p className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  {securityStats?.totalLogs || 0}
                </p>
                <p className="text-gray-500 text-xs">All time</p>
              </div>
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Security Events</h3>
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
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Export Logs
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {auditLogger.getRecentLogs(20).map((log, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className={`w-3 h-3 rounded-full ${
                    log.event === 'LOGIN_SUCCESS' ? 'bg-green-500' :
                    log.event === 'LOGIN_FAILED' ? 'bg-red-500' :
                    log.event === 'LOGOUT' ? 'bg-yellow-500' :
                    log.event === 'ACCOUNT_LOCKED' ? 'bg-red-600' :
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

          {/* Security Settings */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6">Security Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Authentication Settings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Max Login Attempts:</span>
                    <span className="text-white font-mono">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Lockout Duration:</span>
                    <span className="text-white font-mono">15 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Session Timeout:</span>
                    <span className="text-white font-mono">30 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">JWT Expiry:</span>
                    <span className="text-white font-mono">24 hours</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Security Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">JWT Token Authentication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Rate Limiting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Account Lockout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Audit Logging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security PIN Modal */}
      {showSecurityPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl border border-red-500/30 p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Security Access Required</h2>
              <p className="text-gray-400">Enter your 6-digit security PIN to access the Security Center</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3 text-center">Security PIN</label>
                <div className="flex justify-center">
                  <input
                    type="password"
                    value={securityPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setSecurityPin(value);
                    }}
                    className="w-48 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-gray-400 focus:outline-none focus:border-red-500/50 transition-all duration-300"
                    placeholder="••••••"
                    maxLength="6"
                    autoFocus
                  />
                </div>
                <p className="text-gray-500 text-sm text-center mt-2">Default PIN: 123456</p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Access Security Center</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSecurityPinModal(false);
                    setSecurityPin('');
                  }}
                  className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/30 hover:border-gray-500/50 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-yellow-400 text-sm">Security Center contains sensitive configuration settings</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 