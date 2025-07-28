import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import auditLogger from './auditLogger';

// Secure admin credentials (should be moved to environment variables)
const DEFAULT_ADMIN_USERNAME = 'lost_admin_2024';
const DEFAULT_ADMIN_PASSWORD = 'LostBrand2024!'; // This will be hashed
const JWT_SECRET = '89cf3dc66fc46429ca1fe9d2ed3600f744e66573e56fe1a69700d2f9fb487e0a34879f10a2bb2f972ea65b6af19e2b590616698fd8b6d3da895ab5031429979a';
const JWT_EXPIRY = '24h';

// Security settings
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

class AuthService {
  constructor() {
    this.loginAttempts = new Map();
    this.sessions = new Map();
  }

  // Hash password using bcrypt
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password against hash
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Check if user is locked out
  isLockedOut(username) {
    const attempts = this.loginAttempts.get(username);
    if (!attempts) return false;

    const { count, lastAttempt } = attempts;
    const timeSinceLastAttempt = Date.now() - lastAttempt;

    if (count >= MAX_LOGIN_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
      return true;
    }

    // Reset if lockout period has passed
    if (timeSinceLastAttempt >= LOCKOUT_DURATION) {
      this.loginAttempts.delete(username);
      return false;
    }

    return false;
  }

  // Record failed login attempt
  recordFailedAttempt(username) {
    const attempts = this.loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(username, attempts);
    
    // Log failed attempt
    auditLogger.logLoginFailed(username, 'Invalid credentials');
    
    // Log rate limit exceeded if applicable
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      auditLogger.logRateLimitExceeded(username, attempts.count);
      auditLogger.logAccountLocked(username, LOCKOUT_DURATION / 1000 / 60);
    }
  }

  // Clear failed attempts on successful login
  clearFailedAttempts(username) {
    this.loginAttempts.delete(username);
  }

  // Generate JWT token
  async generateToken(payload) {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const alg = 'HS256';
    
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(secret);
    
    return jwt;
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      return payload;
    } catch (error) {
      return null;
    }
  }

  // Authenticate admin user
  async authenticateAdmin(username, password) {
    // Check if user is locked out
    if (this.isLockedOut(username)) {
      const attempts = this.loginAttempts.get(username);
      const remainingTime = Math.ceil((LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 1000 / 60);
      throw new Error(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
    }

    // Verify credentials
    if (username !== DEFAULT_ADMIN_USERNAME) {
      this.recordFailedAttempt(username);
      throw new Error('Invalid credentials');
    }

    // For demo purposes, we'll hash the default password and compare
    // In production, you'd store the hash in environment variables
    const hashedPassword = await this.hashPassword(DEFAULT_ADMIN_PASSWORD);
    const isValidPassword = await this.verifyPassword(password, hashedPassword);

    if (!isValidPassword) {
      this.recordFailedAttempt(username);
      throw new Error('Invalid credentials');
    }

    // Clear failed attempts on successful login
    this.clearFailedAttempts(username);

    // Log successful login
    auditLogger.logLoginSuccess(username);

    // Generate token
    const token = await this.generateToken({
      username,
      role: 'admin',
      timestamp: Date.now()
    });

    // Store session
    this.sessions.set(token, {
      username,
      role: 'admin',
      loginTime: Date.now(),
      lastActivity: Date.now()
    });

    return {
      token,
      user: { username, role: 'admin' },
      expiresIn: JWT_EXPIRY
    };
  }

  // Validate session
  async validateSession(token) {
    const session = this.sessions.get(token);
    if (!session) return null;

    // Verify JWT token
    const payload = await this.verifyToken(token);
    if (!payload) {
      this.sessions.delete(token);
      return null;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - session.lastActivity;

    // Check if session has timed out
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      auditLogger.logSessionExpired(session.username);
      this.sessions.delete(token);
      return null;
    }

    // Update last activity
    session.lastActivity = now;
    this.sessions.set(token, session);

    return session;
  }

  // Logout user
  logout(token) {
    const session = this.sessions.get(token);
    if (session) {
      auditLogger.logLogout(session.username);
    }
    this.sessions.delete(token);
  }

  // Get remaining login attempts
  getRemainingAttempts(username) {
    const attempts = this.loginAttempts.get(username);
    if (!attempts) return MAX_LOGIN_ATTEMPTS;
    return Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count);
  }

  // Get lockout time remaining
  getLockoutTimeRemaining(username) {
    const attempts = this.loginAttempts.get(username);
    if (!attempts || attempts.count < MAX_LOGIN_ATTEMPTS) return 0;
    
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    return Math.max(0, LOCKOUT_DURATION - timeSinceLastAttempt);
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService; 