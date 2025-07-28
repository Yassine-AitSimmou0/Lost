// Twilio WhatsApp API Integration
// This provides truly automatic WhatsApp messaging

class TwilioWhatsAppAPI {
  constructor() {
    this.accountSid = null;
    this.authToken = null;
    this.fromNumber = null;
    this.toNumber = null;
    this.isConfigured = false;
    this.baseUrl = 'https://api.twilio.com/2010-04-01';
  }

  // Configure the API with your Twilio credentials
  configure(accountSid, authToken, fromNumber, toNumber) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
    this.toNumber = toNumber;
    this.isConfigured = true;

    // Save configuration to localStorage
    localStorage.setItem('twilioConfig', JSON.stringify({
      accountSid,
      authToken,
      fromNumber,
      toNumber
    }));

    console.log('Twilio WhatsApp API configured successfully');
  }

  // Load configuration from localStorage
  loadConfiguration() {
    try {
      const config = localStorage.getItem('twilioConfig');
      if (config) {
        const { accountSid, authToken, fromNumber, toNumber } = JSON.parse(config);
        this.configure(accountSid, authToken, fromNumber, toNumber);
        return true;
      }
    } catch (error) {
      console.error('Error loading Twilio configuration:', error);
    }
    return false;
  }

  // Send automatic WhatsApp message
  async sendMessage(message) {
    if (!this.isConfigured) {
      throw new Error('Twilio API not configured. Please set up your credentials first.');
    }

    try {
      // Create the request body
      const body = new URLSearchParams({
        'To': `whatsapp:${this.toNumber}`,
        'From': `whatsapp:${this.fromNumber}`,
        'Body': message
      });

      // Make the API request
      const response = await fetch(`${this.baseUrl}/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.accountSid}:${this.authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twilio API Error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('WhatsApp message sent successfully:', result.sid);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  // Send order notification automatically
  async sendOrderNotification(order) {
    const message = this.createOrderMessage(order);
    return await this.sendMessage(message);
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
    const message = this.createLowStockMessage(product);
    return await this.sendMessage(message);
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

  // Test the API connection
  async testConnection() {
    try {
      const testMessage = `🧪 *TEST MESSAGE*

This is a test message from your Lost Clothing Brand admin dashboard.

If you receive this message, your Twilio WhatsApp API is working correctly!

📅 *Sent:* ${new Date().toLocaleString()}

---
*Lost Clothing Brand*
*API Test*`;

      const result = await this.sendMessage(testMessage);
      return { success: true, messageId: result.sid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured,
      accountSid: this.accountSid ? '***' + this.accountSid.slice(-4) : null,
      fromNumber: this.fromNumber,
      toNumber: this.toNumber
    };
  }

  // Clear configuration
  clearConfiguration() {
    this.accountSid = null;
    this.authToken = null;
    this.fromNumber = null;
    this.toNumber = null;
    this.isConfigured = false;
    localStorage.removeItem('twilioConfig');
    console.log('Twilio configuration cleared');
  }
}

// Create singleton instance
const twilioWhatsApp = new TwilioWhatsAppAPI();

export default twilioWhatsApp; 