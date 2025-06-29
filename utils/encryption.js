const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// Get encryption key from environment or generate one
const getEncryptionKey = () => {
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey) {
    return crypto.scryptSync(envKey, 'salt', KEY_LENGTH);
  }
  // Fallback key for development (should be set in production)
  return crypto.scryptSync('fallback-key-change-in-production', 'salt', KEY_LENGTH);
};

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text in format: iv:salt:tag:encryptedData
 */
const encrypt = (text) => {
  try {
    if (!text) return null;
    
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(salt);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Return in format: iv:salt:tag:encryptedData
    return `${iv.toString('hex')}:${salt.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted text in format: iv:salt:tag:encryptedData
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return null;
    
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted text format');
    }
    
    const [ivHex, saltHex, tagHex, encryptedData] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const salt = Buffer.from(saltHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(salt);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} - True if password matches
 */
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

/**
 * Generate secure random token
 * @param {number} length - Token length (default: 32)
 * @returns {string} - Random token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate API key
 * @returns {string} - API key in format: prefix.random
 */
const generateApiKey = () => {
  const prefix = 'cyber_ai';
  const random = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${random}`;
};

/**
 * Hash sensitive data for storage (one-way)
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
const hashSensitiveData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate checksum for data integrity
 * @param {string} data - Data to checksum
 * @returns {string} - Checksum
 */
const generateChecksum = (data) => {
  return crypto.createHash('md5').update(data).digest('hex');
};

/**
 * Encrypt object and return encrypted string
 * @param {object} obj - Object to encrypt
 * @returns {string} - Encrypted object string
 */
const encryptObject = (obj) => {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString);
};

/**
 * Decrypt object string and return object
 * @param {string} encryptedObj - Encrypted object string
 * @returns {object} - Decrypted object
 */
const decryptObject = (encryptedObj) => {
  const jsonString = decrypt(encryptedObj);
  return JSON.parse(jsonString);
};

/**
 * Generate secure random string
 * @param {number} length - String length
 * @param {string} charset - Character set (default: alphanumeric)
 * @returns {string} - Random string
 */
const generateRandomString = (length = 10, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  const charactersLength = charset.length;
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  comparePassword,
  generateSecureToken,
  generateApiKey,
  hashSensitiveData,
  generateChecksum,
  encryptObject,
  decryptObject,
  generateRandomString
}; 