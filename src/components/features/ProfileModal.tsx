import React from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Landmark, 
  Award, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  LogOut,
  Layers,
  FileCheck
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenKyc: () => void;
  onOpenCibil: () => void;
  onOpenApiConfig: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenKyc,
  onOpenCibil,
  onOpenApiConfig,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#004856] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D4EFF2] text-[#004856] flex items-center justify-center text-xl font-bold shadow-xs">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{user.fullName}</h2>
              <p className="text-xs text-cyan-100">{user.phone} • {user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* KYC Status Banner */}
          <div 
            onClick={() => { onClose(); onOpenKyc(); }}
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
              user.kycStatus === 'verified'
                ? 'bg-teal-50/70 border-teal-200 hover:bg-teal-50'
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100/70 animate-pulse'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-5 h-5 ${user.kycStatus === 'verified' ? 'text-teal-800' : 'text-amber-600'}`} />
              <div>
                <p className="font-bold text-slate-900">KYC Verification Status</p>
                <p className="text-[11px] text-slate-500">
                  {user.kycStatus === 'verified' ? '100% Digital KYC Verified' : 'Action Required: Complete Aadhaar e-KYC'}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              user.kycStatus === 'verified' ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
              {user.kycStatus === 'verified' ? 'Active' : 'Pending'}
            </span>
          </div>

          {/* User Financial Attributes */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Employment & Income</h3>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-[10px] text-slate-500 block">Employment Type</span>
                <span className="font-semibold text-slate-900 capitalize">{user.employmentType.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Monthly In-hand Income</span>
                <span className="font-semibold text-teal-800">₹{user.monthlyIncome.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PAN Number</span>
                <span className="font-mono font-semibold text-slate-900">{user.panNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Location</span>
                <span className="font-semibold text-slate-900">{user.city}, {user.pinCode}</span>
              </div>
            </div>
          </div>

          {/* Linked Bank Account */}
          {user.bankDetails && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-teal-800" />
                  <span>Linked Disbursal Bank Account</span>
                </h3>
                <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                  Verified
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{user.bankDetails.bankName}</p>
              <p className="text-slate-500">A/C: {user.bankDetails.accountNumber} • IFSC: {user.bankDetails.ifscCode}</p>
            </div>
          )}

          {/* Backend API specs trigger */}
          <button
            onClick={() => { onClose(); onOpenApiConfig(); }}
            className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-left flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-800" />
              <span className="font-medium text-slate-900">Separated API Architecture & Backend Setup</span>
            </div>
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">Docs</span>
          </button>

          {/* Logout Action */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
