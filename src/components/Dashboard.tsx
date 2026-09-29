import React, { useState } from "react";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Calendar,
  Clock,
  Edit2,
  KeyRound,
  LogOut,
  Send,
  ExternalLink,
  Sparkles,
  Code2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
];

export const Dashboard: React.FC = () => {
  const { user, logout, verifyCurrentEmail, resetPassword, updateUserDisplayName, firebaseProjectId } = useAuth();
  const [copiedUid, setCopiedUid] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState(user?.photoURL || "");
  const [showRawSession, setShowRawSession] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  if (!user) return null;

  const handleCopyUid = () => {
    if (user.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSaveProfile = async () => {
    setUpdatingProfile(true);
    await updateUserDisplayName(newName, customPhotoUrl);
    setUpdatingProfile(false);
    setIsEditingName(false);
    setShowAvatarPicker(false);
  };

  const handleSelectAvatar = (url: string) => {
    setCustomPhotoUrl(url);
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    await verifyCurrentEmail();
    setSendingVerification(false);
  };

  const providerId = user.providerData?.[0]?.providerId || "password";
  const isGoogle = providerId.includes("google");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              {user.photoURL || customPhotoUrl ? (
                <img
                  src={user.photoURL || customPhotoUrl}
                  alt={user.displayName || "User"}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg group-hover:opacity-90 transition"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold ring-4 ring-white/10 shadow-lg">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-full border-2 border-slate-900 shadow">
                <ImageIcon className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {user.displayName || "Authenticated User"}
                </h1>
                <button
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="p-1 text-slate-400 hover:text-white transition rounded-md"
                  title="Edit display name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-slate-300 flex items-center space-x-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 opacity-70" />
                <span>{user.email}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Verification Badge */}
                {user.emailVerified ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Account</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Unverified Email</span>
                  </span>
                )}

                {/* Provider badge */}
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  <span>Provider:</span>
                  <span className="font-semibold text-white capitalize">{isGoogle ? "Google" : "Password"}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0">
            <button
              onClick={() => logout()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-rose-600 hover:text-white text-slate-200 border border-white/10 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Project: {firebaseProjectId}
            </span>
          </div>
        </div>

        {/* Inline Name Editor */}
        {isEditingName && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter full name"
              className="w-full sm:w-auto flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={handleSaveProfile}
                disabled={updatingProfile}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
              >
                {updatingProfile ? "Saving..." : "Save Name"}
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Avatar Picker Dropdown */}
        {showAvatarPicker && (
          <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Choose an Avatar Preset:</span>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {PRESET_AVATARS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preset-${idx}`}
                  onClick={() => handleSelectAvatar(url)}
                  className={`w-10 h-10 rounded-xl object-cover cursor-pointer hover:scale-105 transition border-2 ${
                    customPhotoUrl === url ? "border-indigo-400 ring-2 ring-indigo-400/50" : "border-slate-700"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                placeholder="Or paste an image URL..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveProfile}
                disabled={updatingProfile}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unverified Email Warning Banner */}
      {!user.emailVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">Your email address is unverified</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Verify your email to guarantee account ownership and secure your credentials.
              </p>
            </div>
          </div>
          <button
            onClick={handleSendVerification}
            disabled={sendingVerification}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition cursor-pointer shadow-xs shrink-0 disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sendingVerification ? "Sending..." : "Send Verification Link"}</span>
          </button>
        </div>
      )}

      {/* Account Info Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Firebase UID */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium uppercase tracking-wider">Firebase User UID</span>
            <button
              onClick={handleCopyUid}
              className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              {copiedUid ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-all select-all">
            {user.uid}
          </p>
        </div>

        {/* Auth Provider */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Authentication Method
          </span>
          <div className="flex items-center space-x-3 pt-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              {isGoogle ? <Sparkles className="w-4 h-4 text-amber-500" /> : <KeyRound className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isGoogle ? "Google Sign-In (OAuth)" : "Email & Password Auth"}
              </p>
              <p className="text-xs text-slate-500 font-mono">{providerId}</p>
            </div>
          </div>
        </div>

        {/* Created Timestamp */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Account Creation
          </span>
          <div className="flex items-center space-x-3 pt-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
              <p className="text-xs text-slate-500">
                {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleTimeString() : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Last Sign-in Timestamp */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Last Sign-In Session
          </span>
          <div className="flex items-center space-x-3 pt-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user.metadata.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
              <p className="text-xs text-slate-500">
                {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleTimeString() : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Security Actions Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center space-x-2">
          <KeyRound className="w-4 h-4 text-indigo-600" />
          <span>Security & Quick Management</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Reset password */}
          <button
            onClick={() => user.email && resetPassword(user.email)}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition group cursor-pointer"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900">
              Send Password Reset Link
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Receive a secure reset link at {user.email}
            </p>
          </button>

          {/* Email verification trigger */}
          <button
            onClick={handleSendVerification}
            disabled={user.emailVerified || sendingVerification}
            className={`p-3.5 rounded-xl border text-left transition group ${
              user.emailVerified
                ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                : "border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 cursor-pointer"
            }`}
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">
              {user.emailVerified ? "Email is already verified" : "Dispatch Verification Email"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {user.emailVerified ? "Ownership confirmed" : "Trigger an email verification link"}
            </p>
          </button>
        </div>
      </div>

      {/* Developer Raw Session Inspector */}
      <div className="rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowRawSession(!showRawSession)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-mono font-medium hover:bg-slate-800/50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-white">Active Firebase Auth Session Payload</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>{showRawSession ? "Collapse" : "Expand inspector"}</span>
            {showRawSession ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showRawSession && (
          <div className="p-5 border-t border-slate-800 bg-slate-950 font-mono text-xs overflow-x-auto text-emerald-400">
            <pre>
              {JSON.stringify(
                {
                  uid: user.uid,
                  email: user.email,
                  emailVerified: user.emailVerified,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  isAnonymous: user.isAnonymous,
                  tenantId: user.tenantId,
                  providerData: user.providerData,
                  metadata: {
                    creationTime: user.metadata.creationTime,
                    lastSignInTime: user.metadata.lastSignInTime,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
