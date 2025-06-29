const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
      });

      logger.info('Firebase Admin SDK initialized successfully');
    }

    return firebaseApp;
  } catch (error) {
    logger.error('Firebase initialization failed:', error);
    throw error;
  }
};

const getFirebaseAuth = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
};

const getFirebaseFirestore = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
};

const verifyIdToken = async (idToken) => {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase token verification failed:', error);
    throw error;
  }
};

const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    const auth = getFirebaseAuth();
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    logger.error('Firebase custom token creation failed:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const auth = getFirebaseAuth();
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    logger.error('Firebase user lookup failed:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const auth = getFirebaseAuth();
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: false
    });
    return userRecord;
  } catch (error) {
    logger.error('Firebase user creation failed:', error);
    throw error;
  }
};

const updateUser = async (uid, userData) => {
  try {
    const auth = getFirebaseAuth();
    const userRecord = await auth.updateUser(uid, userData);
    return userRecord;
  } catch (error) {
    logger.error('Firebase user update failed:', error);
    throw error;
  }
};

const deleteUser = async (uid) => {
  try {
    const auth = getFirebaseAuth();
    await auth.deleteUser(uid);
    return true;
  } catch (error) {
    logger.error('Firebase user deletion failed:', error);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseFirestore,
  verifyIdToken,
  createCustomToken,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
}; 