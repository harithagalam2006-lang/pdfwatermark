import React, { useState } from "react";
import { X, Database, ExternalLink, Copy, Check, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { firebaseConfig } from "../firebase";

interface FirebaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseInfoModal: React.FC<FirebaseInfoModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const currentOrigin = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Firebase Configuration</h3>
              <p className="text-xs text-slate-500">Active project credentials & setup checklist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials table */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Connected Project Parameters
          </span>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden text-xs">
            {Object.entries(firebaseConfig).map(([k, v]) => (
              <div key={k} className="p-2.5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50">
                <span className="font-mono text-slate-500 font-medium">{k}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
                    {String(v)}
                  </span>
                  <button
                    onClick={() => copyValue(k, String(v))}
                    className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                    title="Copy"
                  >
                    {copiedKey === k ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist for Firebase Console */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Firebase Console Setup Checklist</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            If you encounter errors like <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">auth/operation-not-allowed</code> or unauthorized domain:
          </p>
          <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-4">
            <li>
              Enable <strong>Email/Password</strong> provider in Firebase Authentication console.
            </li>
            <li>
              Enable <strong>Google</strong> provider in Firebase Authentication console (with support email).
            </li>
            <li>
              Add this app domain (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px] break-all">{currentOrigin.replace(/^https?:\/\//, '')}</code>) to <strong>Authorized domains</strong> under Firebase Authentication &gt; Settings.
            </li>
          </ul>

          <div className="pt-2">
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition shadow-xs"
            >
              <span>Open Firebase Authentication Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
