import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Fingerprint, 
  Camera, 
  Landmark, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { kycApi, KycState } from '../../api/kycApi';
import { UserProfile } from '../../types';

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onKycCompleted: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({
  isOpen,
  onClose,
  user,
  onKycCompleted,
}) => {
  const [kycState, setKycState] = useState<KycState | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step 1: PAN
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [panName, setPanName] = useState('SUDIPTA ROY');
  const [dob, setDob] = useState('1996-05-14');

  // Step 2: Aadhaar
  const [aadhaarNumber, setAadhaarNumber] = useState('782945128921');
  const [aadhaarOtp, setAadhaarOtp] = useState('4582');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);

  // Step 3: Video / Selfie
  const [selfieCaptured, setSelfieCaptured] = useState(false);

  // Step 4: Bank Penny Drop
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState('50100482914892');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [accountHolder, setAccountHolder] = useState('SUDIPTA ROY');

  useEffect(() => {
    if (isOpen) {
      loadKycState();
    }
  }, [isOpen]);

  const loadKycState = async () => {
    setLoading(true);
    try {
      const res = await kycApi.getKycState();
      setKycState(res.data);
      setActiveStep(res.data.currentStep || 1);
      if (res.data.panDetails.panNumber) setPanNumber(res.data.panDetails.panNumber);
      if (res.data.panDetails.fullNameAsPerPan) setPanName(res.data.panDetails.fullNameAsPerPan);
      if (res.data.aadhaarDetails.aadhaarNumber) setAadhaarNumber(res.data.aadhaarDetails.aadhaarNumber);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Submit
  const handleVerifyPan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await kycApi.verifyPan(panNumber, dob, panName);
      setSuccessMessage('PAN validated successfully with NSDL');
      setActiveStep(2);
    } catch (err: any) {
      setError(err.message || 'PAN validation failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Send Aadhaar OTP
  const handleSendAadhaarOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      await kycApi.sendAadhaarOtp(aadhaarNumber);
      setAadhaarOtpSent(true);
      setSuccessMessage('UIDAI DigiLocker OTP sent to registered mobile');
    } catch (err: any) {
      setError(err.message || 'Failed to send Aadhaar OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Verify Aadhaar OTP
  const handleVerifyAadhaarOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      await kycApi.verifyAadhaarOtp(aadhaarOtp);
      setSuccessMessage('Aadhaar DigiLocker verified');
      setActiveStep(3);
    } catch (err: any) {
      setError(err.message || 'Aadhaar verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Capture Selfie
  const handleCaptureSelfie = async () => {
    setError(null);
    setLoading(true);
    try {
      setSelfieCaptured(true);
      await kycApi.completeVideoKyc();
      setSuccessMessage('Face match confirmed (98.4% match with Aadhaar/PAN photo)');
      setActiveStep(4);
    } catch (err: any) {
      setError(err.message || 'Video KYC match failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Bank Penny Drop
  const handleVerifyBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await kycApi.verifyBankPennyDrop(accountNumber, ifscCode, bankName, accountHolder);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      setSuccessMessage('₹1.00 deposited! Full KYC Verified successfully.');
      onKycCompleted();
    } catch (err: any) {
      setError(err.message || 'Bank verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const STEPS = [
    { num: 1, label: 'PAN Card', icon: CreditCard },
    { num: 2, label: 'Aadhaar e-KYC', icon: Fingerprint },
    { num: 3, label: 'Live Video Selfie', icon: Camera },
    { num: 4, label: 'Bank Penny Drop', icon: Landmark },
  ];

  const isAllVerified = kycState?.status === 'verified' || user?.kycStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-teal-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 border border-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Paperless 1-Minute Digital KYC</h2>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-teal-700">
                  RBI Compliant
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Unlock instant loan disbursal, highest credit limits, and zero-fee withdrawals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 p-2 sm:p-3 gap-1">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isDone = s.num < activeStep || isAllVerified;
            const isCurrent = s.num === activeStep && !isAllVerified;
            return (
              <button
                key={s.num}
                onClick={() => isDone && setActiveStep(s.num)}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-teal-900 border border-teal-800 shadow-xs'
                    : isDone
                    ? 'text-teal-800 hover:bg-slate-100'
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-800" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-bold">Step {s.num}</span>
                </div>
                <span className="text-[11px] font-semibold truncate hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: PAN */}
          {activeStep === 1 && (
            <form onSubmit={handleVerifyPan} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-800" />
                  <span>Step 1: Income Tax PAN Card Verification</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Instant real-time validation with NSDL database for KYC authentication
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name (as per PAN)</label>
                  <input
                    type="text"
                    value={panName}
                    onChange={(e) => setPanName(e.target.value)}
                    placeholder="SUDIPTA ROY"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Validating PAN...' : 'Verify PAN & Continue'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DigiLocker Aadhaar */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-teal-800" />
                  <span>Step 2: Paperless Aadhaar e-KYC (DigiLocker)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Secure OTP verification via UIDAI. Your original Aadhaar remains encrypted.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">12-Digit Aadhaar Number</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="782945128921"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                {!aadhaarOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Requesting UIDAI OTP...' : 'Send DigiLocker OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-700">UIDAI OTP</label>
                        <span className="text-[11px] text-teal-800 font-medium">Demo OTP: 4582</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={aadhaarOtp}
                        onChange={(e) => setAadhaarOtp(e.target.value)}
                        placeholder="4582"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-center text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyAadhaarOtp}
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{loading ? 'Verifying DigiLocker...' : 'Verify Aadhaar & Proceed'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Video Selfie */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-800" />
                  <span>Step 3: Live Video Selfie Face Match</span>
                </h3>
                <p className="text-xs text-slate-500">
                  AI liveness detection compares your live photo with official government records
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-dashed border-teal-700 flex items-center justify-center text-teal-800 relative overflow-hidden shadow-2xs">
                  <Camera className="w-8 h-8" />
                  <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">Look directly into camera in good lighting</p>
                  <p className="text-[11px] text-slate-500">Remove glasses, hats, and ensure full face visibility</p>
                </div>

                <button
                  type="button"
                  onClick={handleCaptureSelfie}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>{loading ? 'AI Face Matching...' : 'Simulate Video Selfie Match'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Bank Penny Drop */}
          {activeStep === 4 && (
            <form onSubmit={handleVerifyBank} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-teal-800" />
                  <span>Step 4: Bank Account Verification (₹1 Penny Drop)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Money View deposits ₹1.00 to confirm account ownership for direct loan disbursal
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="HDFC Bank Ltd"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="50100482914892"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="HDFC0001234"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-teal-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>{loading ? 'Depositing ₹1.00 & Verifying...' : 'Deposit ₹1 & Complete Full KYC'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Trust strip */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-teal-800" />
              256-Bit Encrypted Data
            </span>
            <span className="text-slate-500">UIDAI & NPCI Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
