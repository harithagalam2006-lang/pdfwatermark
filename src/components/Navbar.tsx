import React from "react";
import { ShieldCheck, Database, ExternalLink, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onOpenConfigModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConfigModal }) => {
  const { user, logout, firebaseProjectId } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">AuthHub</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                Firebase
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Production-grade Authentication Portal</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Firebase Project Badge */}
          <button
            onClick={onOpenConfigModal}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 cursor-pointer"
            title="Click to view Firebase Config and status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>{firebaseProjectId}</span>
          </button>

          {/* Console Link */}
          <a
            href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/providers`}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-indigo-600 px-2 py-1 transition"
            title="Open Firebase Console Authentication Settings"
          >
            <span>Firebase Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate sm:max-w-[160px]">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConfigModal}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2.5 py-1.5 rounded-md hover:bg-indigo-50 transition"
            >
              Config Info
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
