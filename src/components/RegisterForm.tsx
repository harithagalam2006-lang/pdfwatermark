import React, { useState, useMemo } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { signupWithEmail, loginWithGoogle, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [localValidationErr, setLocalValidationErr] = useState<string | null>(null);

  // Password rules validation
  const rules = useMemo(() => {
    return {
      minLength: password.length >= 6,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (rules.minLength) score += 25;
    if (rules.hasLetter) score += 25;
    if (rules.hasNumber) score += 25;
    if (rules.hasSpecial) score += 25;
    return score;
  }, [rules]);

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationErr(null);
    clearError();

    if (!name.trim()) {
      setLocalValidationErr("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setLocalValidationErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalValidationErr("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setLocalValidationErr("Please agree to the Terms of Service to continue.");
      return;
    }

    setSubmitting(true);
    await signupWithEmail(email, password, name);
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    clearError();
    await loginWithGoogle();
    setGoogleSubmitting(false);
  };

  return (
    <div className="w-full">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</h2>
        <p className="text-sm text-slate-500 mt-1">
          Join AuthHub to experience secure Firebase authentication
        </p>
      </div>

      {/* Google Auth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleSubmitting || submitting}
        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all duration-150 flex items-center justify-center space-x-3 shadow-xs hover:shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {googleSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.28 21.43 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
            />
          </svg>
        )}
        <span>Sign up with Google</span>
      </button>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
            Or register with email
          </span>
        </div>
      </div>

      {localValidationErr && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{localValidationErr}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
            className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
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

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength bar */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strengthScore <= 25
                      ? "bg-rose-500 w-1/4"
                      : strengthScore <= 50
                      ? "bg-amber-500 w-2/4"
                      : strengthScore <= 75
                      ? "bg-blue-500 w-3/4"
                      : "bg-emerald-500 w-full"
                  }`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Strength:{" "}
                  <strong className={
                    strengthScore <= 25
                      ? "text-rose-600"
                      : strengthScore <= 50
                      ? "text-amber-600"
                      : strengthScore <= 75
                      ? "text-blue-600"
                      : "text-emerald-600"
                  }>
                    {strengthScore <= 25 ? "Weak" : strengthScore <= 50 ? "Fair" : strengthScore <= 75 ? "Good" : "Strong"}
                  </strong>
                </span>
                <span className="flex items-center space-x-1">
                  {rules.minLength ? (
                    <span className="text-emerald-600 inline-flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> 6+ chars
                    </span>
                  ) : (
                    <span className="text-slate-400">Min 6 chars</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                passwordsMismatch
                  ? "border-rose-300 focus:ring-rose-500"
                  : passwordsMatch
                  ? "border-emerald-300 focus:ring-emerald-500"
                  : "border-slate-200 focus:ring-indigo-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordsMismatch && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center">
              <XCircle className="w-3 h-3 mr-1" /> Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Passwords match
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 mt-0.5"
            />
            <span>
              I agree to the <span className="text-indigo-600 hover:underline">Terms of Service</span> and{" "}
              <span className="text-indigo-600 hover:underline">Privacy Policy</span>
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || googleSubmitting || !agreed}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center space-x-1 cursor-pointer ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </button>
        </p>
      </div>
    </div>
  );
};
