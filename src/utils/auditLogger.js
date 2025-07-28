// Audit Logging System for Security Monitoring
class AuditLogger {
  constructor() {
    this.logs = this.loadLogs();
    this.maxLogs = 1000; // Keep last 1000 logs
  }

  // Load logs from localStorage
  loadLogs() {
    try {
      const stored = localStorage.getItem('auditLogs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading audit logs:', error);
      return [];
    }
  }

  // Save logs to localStorage
  saveLogs() {
    try {
      localStorage.setItem('auditLogs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving audit logs:', error);
    }
  }

  // Add a new log entry
  log(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      ip: 'client-side', // In production, this would come from server
      sessionId: this.generateSessionId()
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.saveLogs();
    this.consoleLog(logEntry);
  }

  // Generate a simple session ID
  generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Console log for development
  consoleLog(logEntry) {
    const colors = {
      'LOGIN_SUCCESS': '🟢',
      'LOGIN_FAILED': '🔴',
      'LOGOUT': '🟡',
      'SESSION_EXPIRED': '🟠',
      'ACCOUNT_LOCKED': '🔒',
      'RATE_LIMIT_EXCEEDED': '⚠️',
      'SECURITY_ALERT': '🚨'
    };

    const emoji = colors[logEntry.event] || '📝';
    console.log(`${emoji} [AUDIT] ${logEntry.event}:`, logEntry.details);
  }

  // Log login success
  logLoginSuccess(username) {
    this.log('LOGIN_SUCCESS', {
      username,
      message: 'Successful login attempt'
    });
  }

  // Log login failure
  logLoginFailed(username, reason) {
    this.log('LOGIN_FAILED', {
      username,
      reason,
      message: 'Failed login attempt'
    });
  }

  // Log logout
  logLogout(username) {
    this.log('LOGOUT', {
      username,
      message: 'User logged out'
    });
  }

  // Log session expiration
  logSessionExpired(username) {
    this.log('SESSION_EXPIRED', {
      username,
      message: 'Session expired due to inactivity'
    });
  }

  // Log account lockout
  logAccountLocked(username, duration) {
    this.log('ACCOUNT_LOCKED', {
      username,
      duration,
      message: `Account locked for ${duration} minutes`
    });
  }

  // Log rate limit exceeded
  logRateLimitExceeded(username, attempts) {
    this.log('RATE_LIMIT_EXCEEDED', {
      username,
      attempts,
      message: `Rate limit exceeded after ${attempts} attempts`
    });
  }

  // Log security alert
  logSecurityAlert(type, details) {
    this.log('SECURITY_ALERT', {
      type,
      details,
      message: `Security alert: ${type}`
    });
  }

  // Get logs for a specific user
  getUserLogs(username) {
    return this.logs.filter(log => 
      log.details.username === username
    );
  }

  // Get logs for a specific event type
  getEventLogs(event) {
    return this.logs.filter(log => log.event === event);
  }

  // Get recent logs (last N entries)
  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  // Get logs within a time range
  getLogsInRange(startDate, endDate) {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Get failed login attempts
  getFailedLoginAttempts(username = null) {
    const failedLogs = this.getEventLogs('LOGIN_FAILED');
    if (username) {
      return failedLogs.filter(log => log.details.username === username);
    }
    return failedLogs;
  }

  // Get security statistics
  getSecurityStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const last24hLogs = this.getLogsInRange(last24h, now);
    const last7dLogs = this.getLogsInRange(last7d, now);

    return {
      totalLogs: this.logs.length,
      last24h: {
        total: last24hLogs.length,
        loginSuccess: last24hLogs.filter(log => log.event === 'LOGIN_SUCCESS').length,
        loginFailed: last24hLogs.filter(log => log.event === 'LOGIN_FAILED').length,
        securityAlerts: last24hLogs.filter(log => log.event === 'SECURITY_ALERT').length
      },
      last7d: {
        total: last7dLogs.length,
        loginSuccess: last7dLogs.filter(log => log.event === 'LOGIN_SUCCESS').length,
        loginFailed: last7dLogs.filter(log => log.event === 'LOGIN_FAILED').length,
        accountLocked: last7dLogs.filter(log => log.event === 'ACCOUNT_LOCKED').length
      },
      topFailedUsernames: this.getTopFailedUsernames()
    };
  }

  // Get top usernames with failed attempts
  getTopFailedUsernames() {
    const failedLogs = this.getEventLogs('LOGIN_FAILED');
    const usernameCounts = {};

    failedLogs.forEach(log => {
      const username = log.details.username;
      usernameCounts[username] = (usernameCounts[username] || 0) + 1;
    });

    return Object.entries(usernameCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([username, count]) => ({ username, count }));
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  // Export logs as JSON
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
const auditLogger = new AuditLogger();

export default auditLogger; 