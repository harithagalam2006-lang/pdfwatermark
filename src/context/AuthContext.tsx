import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth, googleProvider, getFriendlyErrorMessage, firebaseConfig } from "../firebase";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  notice: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  verifyCurrentEmail: () => Promise<boolean>;
  updateUserDisplayName: (name: string, photoURL?: string) => Promise<boolean>;
  clearError: () => void;
  clearNotice: () => void;
  setErrorMsg: (msg: string | null) => void;
  setNoticeMsg: (msg: string | null) => void;
  firebaseProjectId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);
  const clearNotice = () => setNotice(null);

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      setNotice("Successfully signed in!");
      return true;
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      return false;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string): Promise<boolean> => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim() && cred.user) {
        await updateProfile(cred.user, {
          displayName: name.trim()
        });
        // Force refresh user state so displayName appears immediately
        setUser({ ...auth.currentUser! });
      }
      setNotice("Account created successfully! Welcome aboard.");
      return true;
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setNotice("Successfully authenticated with Google!");
      return true;
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
      setNotice("You have been signed out.");
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice(`Password reset instructions have been sent to ${email.trim()}. Please check your inbox.`);
      return true;
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      return false;
    }
  };

  const verifyCurrentEmail = async (): Promise<boolean> => {
    setError(null);
    if (!auth.currentUser) {
      setError("No user is currently signed in.");
      return false;
    }
    try {
      await sendEmailVerification(auth.currentUser);
      setNotice(`Verification email sent to ${auth.currentUser.email}. Please check your inbox.`);
      return true;
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      return false;
    }
  };

  const updateUserDisplayName = async (name: string, photoURL?: string): Promise<boolean> => {
    setError(null);
    if (!auth.currentUser) return false;
    try {
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
        photoURL: photoURL || auth.currentUser.photoURL
      });
      setUser({ ...auth.currentUser });
      setNotice("Profile updated successfully!");
      return true;
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        notice,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        verifyCurrentEmail,
        updateUserDisplayName,
        clearError,
        clearNotice,
        setErrorMsg: setError,
        setNoticeMsg: setNotice,
        firebaseProjectId: firebaseConfig.projectId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
