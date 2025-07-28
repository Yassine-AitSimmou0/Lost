// WhatsApp Notification Utility
// This uses WhatsApp Web API to send notifications

class WhatsAppNotifier {
  constructor() {
    this.adminPhoneNumber = null; // Will be set from admin settings
    this.isEnabled = false;
  }

  // Initialize the notifier with admin phone number
  initialize(phoneNumber) {
    this.adminPhoneNumber = phoneNumber;
    this.isEnabled = true;
    console.log('WhatsApp notifications enabled for:', phoneNumber);
  }

  // Format phone number for WhatsApp
  formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present (assuming +1 for US)
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }
    
    // Add + prefix
    return '+' + cleaned;
  }

  // Send order notification
  async sendOrderNotification(order) {
    if (!this.isEnabled || !this.adminPhoneNumber) {
      console.log('WhatsApp notifications not configured');
      return false;
    }

    const formattedPhone = this.formatPhoneNumber(this.adminPhoneNumber);
    const message = this.createOrderMessage(order);
    
    try {
      // Create WhatsApp Web URL with pre-filled message
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp Web in new window/tab
      window.open(whatsappUrl, '_blank', 'width=800,height=600');
      
      // Show success message
      this.showNotificationSuccess();
      
      console.log('WhatsApp notification prepared for order:', order.id);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  }

  // Show notification success message
  showNotificationSuccess() {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>WhatsApp notification sent!</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Create formatted order message
  createOrderMessage(order) {
    const orderDate = new Date().toLocaleDateString();
    const orderTime = new Date().toLocaleTimeString();
    
    // Ensure order has all required properties with defaults
    const safeOrder = {
      id: order.id || 'N/A',
      customer: order.customer || 'Anonymous Customer',
      total: order.total || 0,
      status: order.status || 'pending',
      items: order.items || [],
      shippingAddress: order.shippingAddress || '',
      customerEmail: order.customerEmail || ''
    };
    
    return `🛍️ *NEW ORDER RECEIVED!*

📦 *Order Details:*
• Order ID: #${safeOrder.id}
• Customer: ${safeOrder.customer}
• Total: $${safeOrder.total}
• Status: ${safeOrder.status.toUpperCase()}

📅 *Order Date:* ${orderDate} at ${orderTime}

🛒 *Items:*
${safeOrder.items && safeOrder.items.length > 0 ? 
  safeOrder.items.map(item => 
    `• ${item.name || 'Product'} - $${item.price || 0} (Qty: ${item.quantity || 1})`
  ).join('\n') : '• Items details available in dashboard'}

📍 *Shipping Address:*
${safeOrder.shippingAddress || 'Address available in dashboard'}

📞 *Customer Contact:*
${safeOrder.customerEmail || 'Email available in dashboard'}

---
*Lost Clothing Brand*
*Admin Dashboard Notification*`;
  }

  // Send low stock alert
  async sendLowStockAlert(product) {
    if (!this.isEnabled || !this.adminPhoneNumber) {
      return false;
    }

    const formattedPhone = this.formatPhoneNumber(this.adminPhoneNumber);
    const message = this.createLowStockMessage(product);
    
    try {
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      return true;
    } catch (error) {
      console.error('Error sending low stock notification:', error);
      return false;
    }
  }

  // Create low stock message
  createLowStockMessage(product) {
    return `⚠️ *LOW STOCK ALERT!*

📦 *Product:* ${product.name}
💰 *Price:* $${product.price}
📊 *Current Stock:* ${product.stock} units
🏷️ *Category:* ${product.category}

*Action Required:* Please restock this item soon!

---
*Lost Clothing Brand*
*Admin Dashboard Alert*`;
  }

  // Test notification
  async sendTestNotification() {
    if (!this.isEnabled || !this.adminPhoneNumber) {
      return false;
    }

    const testOrder = {
      id: 'TEST-001',
      customer: 'Test Customer',
      total: '99.99',
      status: 'pending',
      items: [
        { name: 'Test Product', price: '99.99', quantity: 1 }
      ]
    };

    return await this.sendOrderNotification(testOrder);
  }

  // Request browser notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Send browser notification
  sendBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/src/Assets/Images/logo.svg',
        badge: '/src/Assets/Images/logo.svg',
        tag: 'order-notification'
      });
    }
  }

  // Enhanced notification with multiple options
  async sendEnhancedNotification(order) {
    // Send browser notification first
    this.sendBrowserNotification(
      '🛍️ New Order Received!',
      `Order #${order.id} from ${order.customer} - $${order.total}`
    );

    // Then send WhatsApp notification
    return await this.sendOrderNotification(order);
  }

  // Disable notifications
  disable() {
    this.isEnabled = false;
    this.adminPhoneNumber = null;
    console.log('WhatsApp notifications disabled');
  }

  // Get current status
  getStatus() {
    return {
      enabled: this.isEnabled,
      phoneNumber: this.adminPhoneNumber
    };
  }
}

// Create singleton instance
const whatsAppNotifier = new WhatsAppNotifier();

export default whatsAppNotifier; 