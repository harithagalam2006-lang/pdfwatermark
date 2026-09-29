import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ForgotPasswordView } from "./components/ForgotPasswordView";
import { Dashboard } from "./components/Dashboard";
import { FirebaseInfoModal } from "./components/FirebaseInfoModal";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ExternalLink,
  Info,
  Sparkles,
  Users
} from "lucide-react";

type AuthView = "login" | "register" | "forgot";

const MainContent: React.FC = () => {
  const { user, loading, error, notice, clearError, clearNotice, firebaseProjectId } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse">
          <Lock className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-600">Connecting to Firebase Auth...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenConfigModal={() => setShowConfigModal(true)} />

      {/* Global Alerts */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4 space-y-3">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm shadow-xs flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-rose-900">Authentication Alert</strong>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                {error.includes("operation-not-allowed") && (
                  <p className="text-xs text-rose-900 mt-2 font-medium">
                    💡 Tip: Go to{" "}
                    <a
                      href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/providers`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold hover:text-rose-950"
                    >
                      Firebase Console &gt; Authentication &gt; Sign-in method
                    </a>{" "}
                    and turn ON "Email/Password" or "Google".
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={clearError}
              className="p-1 text-rose-400 hover:text-rose-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs font-medium text-emerald-900">{notice}</p>
            </div>
            <button
              onClick={clearNotice}
              className="p-1 text-emerald-500 hover:text-emerald-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        {user ? (
          <Dashboard />
        ) : (
          <div className="max-w-md mx-auto w-full">
            {/* Auth Mode Toggle Tabs (when on login or register) */}
            {view !== "forgot" && (
              <div className="grid grid-cols-2 p-1 mb-6 bg-slate-200/80 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    clearError();
                  }}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                    view === "login"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    clearError();
                  }}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                    view === "register"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Auth Card Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100/50 to-transparent pointer-events-none rounded-bl-full" />

              {view === "login" && (
                <LoginForm
                  onSwitchToRegister={() => {
                    setView("register");
                    clearError();
                  }}
                  onSwitchToForgot={() => {
                    setView("forgot");
                    clearError();
                  }}
                />
              )}

              {view === "register" && (
                <RegisterForm
                  onSwitchToLogin={() => {
                    setView("login");
                    clearError();
                  }}
                />
              )}

              {view === "forgot" && (
                <ForgotPasswordView
                  onBackToLogin={() => {
                    setView("login");
                    clearError();
                  }}
                />
              )}
            </div>

            {/* Security Guarantee Pill */}
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Protected by Firebase Auth 256-bit encryption</span>
              <span>•</span>
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Project info
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AuthHub • Connected to Firebase project <code className="font-mono text-slate-600">{firebaseProjectId}</code></span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowConfigModal(true)}
              className="hover:text-slate-600 transition cursor-pointer"
            >
              Config Inspector
            </button>
            <a
              href="https://firebase.google.com/docs/auth"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-600 transition inline-flex items-center space-x-1"
            >
              <span>Firebase Auth Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Config Details Modal */}
      <FirebaseInfoModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
