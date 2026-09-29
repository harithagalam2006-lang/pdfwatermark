import React, { useState } from "react";
import { Mail, ArrowLeft, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onBackToLogin }) => {
  const { resetPassword, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    clearError();
    const ok = await resetPassword(email);
    setSubmitting(false);
    if (ok) {
      setSentSuccess(true);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot Password?</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No worries. Enter the email address linked with your account and we'll send you a password reset link.
        </p>
      </div>

      {sentSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-emerald-900">Email Dispatched!</h3>
            <p className="text-xs text-emerald-700 mt-1">
              We sent password recovery instructions to <strong className="text-emerald-900">{email}</strong>. Please check your inbox and spam folder.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSentSuccess(false)}
              className="text-xs text-emerald-700 hover:text-emerald-800 underline font-medium cursor-pointer"
            >
              Send to another email
            </button>
            <span className="hidden sm:inline text-slate-300">•</span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Account Email
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Reset Email...</span>
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>

          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
