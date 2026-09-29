import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  type User
} from "firebase/auth";

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDPMtt8WZEmnYNmj8BvgGkNrfSt-z1_JW8",
  authDomain: "pdfwatermark-d717a.firebaseapp.com",
  projectId: "pdfwatermark-d717a",
  storageBucket: "pdfwatermark-d717a.firebasestorage.app",
  messagingSenderId: "652298254001",
  appId: "1:652298254001:web:e1f39246629b90ccd45490"
};

// Initialize Firebase (singleton pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Human-readable error mapper
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred.";
  
  const code = error.code || "";
  const rawMsg = error.message || "";

  switch (code) {
    case "auth/invalid-email":
      return "The email address format is invalid.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please verify and try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify and try again.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Try logging in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters with letters and numbers.";
    case "auth/operation-not-allowed":
      return "This sign-in provider is not enabled in your Firebase console. Please visit Firebase Console > Authentication > Sign-in method and enable Email/Password or Google.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing the process.";
    case "auth/cancelled-popup-request":
      return "Authentication was cancelled.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Access is temporarily disabled. Please reset your password or try again later.";
    case "auth/requires-recent-login":
      return "This action is sensitive and requires re-authentication. Please log out and back in.";
    case "auth/expired-action-code":
      return "The verification or reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "The verification code is invalid or has already been used.";
    default:
      if (rawMsg.includes("API key not valid")) {
        return "Firebase API Key is invalid or expired. Check your configuration.";
      }
      return rawMsg || "Authentication failed. Please try again.";
  }
}

export type { User };
