import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Camera, 
  Smartphone, 
  CreditCard, 
  Landmark, 
  Sparkles, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { kycApi } from '../api';

interface KycVerificationPageProps {
  user: UserProfile | null;
  onKycVerified: (updatedUser: UserProfile) => void;
  onNavigateToLoans: () => void;
}

export const KycVerificationPage: React.FC<KycVerificationPageProps> = ({
  user,
  onKycVerified,
  onNavigateToLoans,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(user?.kycStatus === 'verified' ? 4 : 1);
  const [aadhaarNumber, setAadhaarNumber] = useState('5489 1234 9876');
  const [otp, setOtp] = useState('123456');
  const [panNumber, setPanNumber] = useState(user?.panNumber || 'ABCDE1234F');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails?.accountNumber || '987654321012');
  const [ifsc, setIfsc] = useState(user?.bankDetails?.ifscCode || 'HDFC0001234');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendAadhaarOtp = async () => {
    setLoading(true);
    try {
      await kycApi.sendAadhaarOtp(aadhaarNumber.replace(/\s+/g, ''));
      setOtpSent(true);
    } catch (e) {
      console.error('OTP send failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAadhaar = async () => {
    setLoading(true);
    try {
      await kycApi.verifyAadhaarOtp(otp);
      setStep(2);
    } catch (e) {
      console.error('Aadhaar verify failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPan = async () => {
    setLoading(true);
    try {
      await kycApi.verifyPan(panNumber, '1996-05-14', user?.fullName || 'User');
      setStep(3);
    } catch (e) {
      console.error('PAN verify failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSelfieAndBank = async () => {
    setLoading(true);
    try {
      await kycApi.completeVideoKyc('data:image/png;base64,mock');
      const bankRes = await kycApi.verifyBankPennyDrop(
        accountNumber,
        ifsc,
        'HDFC Bank',
        user?.fullName || 'User'
      );
      if (user) {
        onKycVerified({ ...user, kycStatus: 'verified', bankDetails: bankRes.data });
      }
      setStep(4);
    } catch (e) {
      console.error('Bank verify failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl bg-teal-900 text-white p-6 sm:p-8 border border-teal-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Government DigiLocker & UIDAI Certified e-KYC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            100% Paperless Digital KYC Verification
          </h1>
          <p className="text-sm text-teal-200 leading-relaxed">
            Verify your identity instantly using Aadhaar OTP and DigiLocker to unlock instant 2-minute loan disbursals up to ₹10 Lakhs with zero physical documentation.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Takes under 60 Seconds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Bank-Grade Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Higher Credit Limit Sanction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, title: 'Aadhaar e-KYC', desc: 'DigiLocker OTP' },
            { num: 2, title: 'PAN Verification', desc: 'Instant NSDL Match' },
            { num: 3, title: 'Selfie & Bank', desc: 'Face & Penny Drop' },
            { num: 4, title: '100% Verified', desc: 'Disbursal Ready' },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="space-y-1.5">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isCompleted
                      ? 'bg-teal-800 text-white'
                      : isCurrent
                      ? 'bg-teal-100 text-teal-900 border-2 border-teal-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div>
                  <p className={`font-bold ${isCurrent ? 'text-teal-900' : 'text-slate-700'}`}>{s.title}</p>
                  <p className="text-[10px] text-slate-400 hidden sm:block">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Stages Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* STEP 1: Aadhaar */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Aadhaar Number & DigiLocker e-KYC</h2>
              <p className="text-xs text-slate-500">Enter your 12-digit Aadhaar number to receive an authentication OTP on your UIDAI registered mobile</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">12-Digit Aadhaar Number</label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="XXXX XXXX XXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-800"
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendAadhaarOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>{loading ? 'Sending OTP to Aadhaar Linked Mobile...' : 'Send DigiLocker OTP'}</span>
              </button>
            ) : (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Enter 6-Digit OTP</span>
                    <span className="text-teal-800">OTP Sent to ******9876</span>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-center tracking-widest text-slate-900 focus:outline-none focus:border-teal-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyAadhaar}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Verifying Aadhaar...' : 'Verify Aadhaar e-KYC'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PAN Card */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Instant PAN Card Validation</h2>
              <p className="text-xs text-slate-500">Instant verification with NSDL/Income Tax Department database</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Permanent Account Number (PAN)</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-teal-800"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-900">PAN Match Verification Details:</span>
              <p className="text-slate-600 text-[11px]">Name: <strong>{user?.fullName || 'Rahul Sharma'}</strong> (100% Name Match)</p>
              <p className="text-slate-600 text-[11px]">Status: <strong className="text-teal-800">Active & Operative (Aadhaar Seeded)</strong></p>
            </div>

            <button
              type="button"
              onClick={handleVerifyPan}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Validating PAN...' : 'Confirm & Proceed to Bank Match'}</span>
            </button>
          </div>
        )}

        {/* STEP 3: Selfie & Penny-Drop Bank */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Live Selfie & Penny-Drop Bank Match</h2>
              <p className="text-xs text-slate-500">We deposit ₹1 in your bank account to verify account holder name for instant disbursals</p>
            </div>

            {/* Selfie Preview */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-teal-100 text-teal-800 flex items-center justify-center">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-slate-900">Face Liveness Match (99.8% Match)</p>
              <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                ✓ Liveness Test Passed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Bank IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-teal-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteSelfieAndBank}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>{loading ? 'Completing Penny-Drop Verification...' : 'Complete e-KYC Verification'}</span>
            </button>
          </div>
        )}

        {/* STEP 4: Verified Success */}
        {step === 4 && (
          <div className="text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-800 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Your DigiLocker e-KYC is 100% Verified! 🛡️</h2>
              <p className="text-xs text-slate-500">
                Your profile is completely verified for instant instant money transfers and high-return investments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">KYC Reference ID:</span>
                <span className="font-mono font-bold text-teal-800">KYC-DL-2026-9874</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DigiLocker Status:</span>
                <span className="font-semibold text-emerald-700">Authenticated (UIDAI Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Eligible Instant Disbursal:</span>
                <span className="font-bold text-slate-900">Up to ₹10,00,000 (Within 2 Minutes)</span>
              </div>
            </div>

            <button
              onClick={onNavigateToLoans}
              className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply for Instant Loan with Verified KYC</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
