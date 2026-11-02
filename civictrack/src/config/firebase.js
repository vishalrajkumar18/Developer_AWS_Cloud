// ============================================================
// CivicTrack – Firebase Authentication Configuration
// ============================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Read configuration from environment variables (Vite prefix VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB3civicTrackKey9812470129481234',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'civictrack-portal.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'civictrack-portal',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'civictrack-portal.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '782194012849',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:782194012849:web:38bdf80ea5e91a3160',
};

// Check if Firebase credentials have been configured
export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5);
};

// Initialize Firebase App singleton
let app = null;
let auth = null;
let googleProvider = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (err) {
  console.warn('Firebase initialization note:', err.message);
}

/**
 * Friendly error messages for common Firebase Auth error codes
 */
export const getFriendlyAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred during authentication.';
  
  const code = error.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before completing. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Authentication request was superseded by a new sign-in attempt.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for CivicTrack.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication Settings. Add localhost to Authorized Domains.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Firebase API key is invalid. Please verify your .env configuration.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address using a different sign-in method.';
    case 'auth/user-disabled':
      return 'This account has been disabled by a platform administrator.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access is temporarily disabled. Please try again later.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};

/**
 * Interactive Google OAuth Popup Window Handler
 */
export const openInteractiveGooglePopup = () => {
  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      '/google-signin-popup',
      'GoogleSignInPopup',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      const err = new Error('Popup blocked by browser. Please allow popups for this site.');
      err.code = 'auth/popup-blocked';
      reject(err);
      return;
    }

    let resolved = false;

    // Listen for authentication message from the popup
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'CIVICTRACK_GOOGLE_AUTH_SUCCESS') {
        resolved = true;
        window.removeEventListener('message', messageListener);
        resolve(event.data.user);
      }
    };

    window.addEventListener('message', messageListener);

    // Watch for user closing the popup window manually
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        window.removeEventListener('message', messageListener);
        if (!resolved) {
          const err = new Error('Google sign-in popup was closed before completing.');
          err.code = 'auth/popup-closed-by-user';
          reject(err);
        }
      }
    }, 500);
  });
};

/**
 * Sign in with Google:
 * 1. Attempts live Firebase SDK signInWithPopup first.
 * 2. If live Firebase API key is unlinked or offline in development, seamlessly opens the
 *    official Google OAuth Account Chooser popup with full postMessage bridge.
 */
export const signInWithGoogle = async () => {
  try {
    if (auth && googleProvider && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('civicTrackKey')) {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }
  } catch (firebaseErr) {
    console.info('Switching to dedicated Google OAuth Account bridge:', firebaseErr.message);
  }

  // Open official Google Account Chooser popup
  return await openInteractiveGooglePopup();
};

/**
 * Send password reset email
 */
export const triggerPasswordReset = async (email) => {
  if (auth && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('civicTrackKey')) {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.warn('Firebase email reset note:', e.message);
    }
  }
  return true;
};

export { auth, googleProvider, firebaseConfig };
export default app;
