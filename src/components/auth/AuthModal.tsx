import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Info, 
  User, 
  MessageSquare, 
  Camera, 
  ShieldCheck, 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Lock,
  Smartphone,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { authApi } from '../../api/authApi';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialStep?: 'consent' | 'welcome' | 'otp';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialStep = 'consent'
}) => {
  // Step navigation: 'consent' (Image 1) -> 'welcome' (Image 2) -> 'otp' -> success
  const [currentStep, setCurrentStep] = useState<'consent' | 'welcome' | 'otp'>(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Consent Checkboxes
  const [consentLoanServices, setConsentLoanServices] = useState(true);
  const [consentPartnersData, setConsentPartnersData] = useState(true);

  // Step 2: Welcome / Login & Register Inputs
  const [selectedEmail, setSelectedEmail] = useState('sudiptasamanta917@gmail.com');
  const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);
  const [customEmailMode, setCustomEmailMode] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('8373041030');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Step 3: OTP State
  const [otpValues, setOtpValues] = useState(['4', '5', '8', '2']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const availableEmails = [
    'sudiptasamanta917@gmail.com',
    'sudipta.roy.work@gmail.com',
    'contact.samanta@outlook.com',
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
      setError(null);
    }
  }, [isOpen, initialStep]);

  useEffect(() => {
    let interval: any;
    if (currentStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  if (!isOpen) return null;

  // Handle Step 1: Agree and Proceed
  const handleConsentProceed = () => {
    if (!consentLoanServices || !consentPartnersData) {
      setError('Please agree to both consent items to proceed with loan services');
      return;
    }
    setError(null);
    setCurrentStep('welcome');
  };

  // Handle Step 2: Send OTP / Continue
  const handleWelcomeContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to continue');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await authApi.sendOtp(mobileNumber);
      setTimer(45);
      setCanResend(false);
      setCurrentStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3: Verify OTP
  const handleVerifyOtp = async () => {
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await authApi.verifyOtp(mobileNumber, enteredOtp);
      const res = await authApi.register({
        fullName: 'Sudipta Samanta',
        phone: mobileNumber.startsWith('+91') ? mobileNumber : `+91${mobileNumber}`,
        email: selectedEmail,
        panNumber: 'ABCDE1234F',
        employmentType: 'salaried',
        monthlyIncome: 65000,
        pinCode: '700001',
        city: 'Kolkata',
        state: 'West Bengal'
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code. Please use demo OTP: 4582');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await authApi.sendOtp(mobileNumber);
      setTimer(45);
      setCanResend(false);
      setOtpValues(['4', '5', '8', '2']);
      setError(null);
    } catch (err: any) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickDemo = async () => {
    setLoading(true);
    try {
      const res = await authApi.quickDemoLogin();
      confetti({ particleCount: 70, spread: 60 });
      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      setError('Failed to load demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      {/* Mobile Screen Container */}
      <div className="relative w-full max-w-md min-h-screen sm:min-h-[640px] bg-white sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================================================= */}
        {/* STEP 1: PERMISSION & DEVICE DATA CONSENT (Exact match to Screenshot 1) */}
        {/* ========================================================================= */}
        {currentStep === 'consent' && (
          <div className="flex-1 flex flex-col justify-between bg-[#F8FAFC]">
            {/* Top Bar with Close X and ArthSetu Brand Logo */}
            <div>
              <div className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
                <button
                  onClick={onClose}
                  className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-6 h-6 stroke-[2.2]" />
                </button>

                {/* Centered ArthSetu Logo */}
                <div className="flex items-center gap-2 pr-5">
                  <div className="w-8 h-8 rounded-full bg-[#003844] flex items-center justify-center text-white shadow-xs">
                    <span className="font-extrabold text-sm tracking-tighter">A</span>
                  </div>
                  <span className="text-xl font-black text-[#003844] tracking-tight">
                    ArthSetu
                  </span>
                </div>

                <div className="w-6" /> {/* spacer for true optical centering */}
              </div>

              {/* Main Content Area */}
              <div className="px-6 pt-5 pb-3 space-y-4">
                {/* Title */}
                <h2 className="text-[21px] sm:text-[23px] font-extrabold text-[#0B1E28] leading-[1.25] tracking-tight">
                  Do you agree to use your device data for Loan service?
                </h2>

                {/* Subtitle */}
                <p className="text-[13px] font-medium text-slate-600 leading-snug">
                  Permission to access and share data from ArthSetu to our lending partners:
                </p>

                {/* 5 Permission Items */}
                <div className="space-y-3.5 pt-1">
                  {/* 1. Location */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F0F4] flex items-center justify-center text-[#004856] shrink-0">
                      <MapPin className="w-5 h-5 fill-[#004856]" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900">
                      Location
                    </span>
                  </div>

                  {/* 2. Device Info */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F0F4] flex items-center justify-center text-[#004856] shrink-0">
                      <Info className="w-5 h-5 fill-[#004856] text-[#E2F0F4]" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900">
                      Device Info
                    </span>
                  </div>

                  {/* 3. User Personal Information */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F0F4] flex items-center justify-center text-[#004856] shrink-0">
                      <User className="w-5 h-5 fill-[#004856] text-[#004856]" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900">
                      User Personal Information
                    </span>
                  </div>

                  {/* 4. Transactional SMS */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F0F4] flex items-center justify-center text-[#004856] shrink-0">
                      <MessageSquare className="w-5 h-5 fill-[#004856] text-[#004856]" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900">
                      Transactional SMS
                    </span>
                  </div>

                  {/* 5. Camera */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F0F4] flex items-center justify-center text-[#004856] shrink-0">
                      <Camera className="w-5 h-5 fill-[#004856] text-[#004856]" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900">
                      Camera
                    </span>
                  </div>
                </div>

                {/* Verified Trust Statement */}
                <div className="flex items-start gap-2.5 pt-2 text-xs text-slate-600 leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-[#006070] shrink-0 mt-0.5" />
                  <p>
                    Your data is secure and will only be shared with our verified{' '}
                    <span className="text-[#006070] font-semibold underline cursor-pointer">
                      lending partners
                    </span>{' '}
                    to process your loan application.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Sheet Modal with Checkboxes & Agree Button (Exact match to Screenshot 1) */}
            <div className="bg-white rounded-t-3xl border-t border-slate-200/80 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] px-6 pt-3 pb-6 space-y-4">
              {/* Drag Handle Bar */}
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto" />

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                  {error}
                </div>
              )}

              {/* Consent Checkbox 1 */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentLoanServices}
                  onChange={(e) => setConsentLoanServices(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-2 border-slate-300 text-[#004856] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium leading-snug">
                  I hereby agree and give consent to share the aforesaid access/data for availing Loan services.
                </span>
              </label>

              {/* Consent Checkbox 2 */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentPartnersData}
                  onChange={(e) => setConsentPartnersData(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-2 border-slate-300 text-[#004856] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium leading-snug">
                  I hereby agree and give consent to ArthSetu and to its lending partners to access and share the aforesaid data.{' '}
                  <span className="text-[#004856] font-bold underline cursor-pointer">
                    See more
                  </span>
                </span>
              </label>

              {/* Agree and Proceed Button */}
              <button
                type="button"
                onClick={handleConsentProceed}
                disabled={!consentLoanServices || !consentPartnersData}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-xs cursor-pointer flex items-center justify-center ${
                  consentLoanServices && consentPartnersData
                    ? 'bg-[#6CA0AC] hover:bg-[#004856] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Agree and Proceed
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: WELCOME / LOGIN & REGISTRATION (Exact match to Screenshot 2) */}
        {/* ========================================================================= */}
        {currentStep === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between bg-white px-6 pt-5 pb-6">
            {/* Top Navigation */}
            <div>
              <div className="flex items-center justify-between pb-3">
                <button
                  onClick={() => setCurrentStep('consent')}
                  className="p-1 -ml-1 text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Welcome Title */}
              <h1 className="text-[32px] font-bold text-slate-900 pt-2 pb-6 tracking-tight">
                Welcome
              </h1>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleWelcomeContinue} className="space-y-4">
                {/* 1. Email ID Input / Dropdown Container */}
                <div className="relative">
                  <div 
                    onClick={() => setIsEmailDropdownOpen(!isEmailDropdownOpen)}
                    className="w-full px-4 pt-2.5 pb-2 rounded-2xl border-2 border-slate-300 hover:border-slate-400 bg-white cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="space-y-0.5 text-left flex-1 pr-2">
                      <label className="text-xs font-medium text-slate-500 block leading-tight">
                        Email ID
                      </label>
                      {!customEmailMode ? (
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {selectedEmail}
                        </p>
                      ) : (
                        <input
                          type="email"
                          value={selectedEmail}
                          onChange={(e) => setSelectedEmail(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent"
                          placeholder="name@gmail.com"
                          autoFocus
                        />
                      )}
                    </div>

                    <ChevronDown className={`w-5 h-5 text-slate-800 transition-transform ${isEmailDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Options */}
                  {isEmailDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
                      {availableEmails.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            setSelectedEmail(em);
                            setCustomEmailMode(false);
                            setIsEmailDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{em}</span>
                          {selectedEmail === em && <Check className="w-4 h-4 text-[#004856]" />}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setCustomEmailMode(true);
                          setIsEmailDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#004856] hover:bg-slate-50 border-t border-slate-100 cursor-pointer"
                      >
                        + Enter custom email address
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Mobile number Container with +91 Prefix */}
                <div className="w-full px-4 pt-2.5 pb-2 rounded-2xl border-2 border-slate-700 bg-white">
                  <label className="text-xs font-medium text-slate-500 block leading-tight">
                    Mobile number
                  </label>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-base font-bold text-slate-900">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="8373041030"
                      className="w-full text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* 3. Checkbox: Send me updates over WhatsApp (Green Checked box) */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div 
                      onClick={() => setWhatsappUpdates(!whatsappUpdates)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                        whatsappUpdates ? 'bg-[#0E5C4E] text-white' : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {whatsappUpdates && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      Send me updates over WhatsApp
                    </span>
                  </label>
                </div>

                {/* 4. Checkbox: Terms of Service & Privacy Policy */}
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-2 border-slate-300 text-[#004856] focus:ring-0 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I accept the{' '}
                      <span className="font-semibold underline text-slate-900 cursor-pointer">
                        Terms of Service & Privacy policy
                      </span>
                      , which includes permission to securely share my data/documents with verified partners and third parties to process my application
                    </span>
                  </label>
                </div>
              </form>
            </div>

            {/* Bottom Continue Button */}
            <div className="pt-6 space-y-3">
              <button
                type="button"
                onClick={handleWelcomeContinue}
                disabled={loading || !acceptTerms || mobileNumber.length < 10}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-xs flex items-center justify-center ${
                  acceptTerms && mobileNumber.length >= 10
                    ? 'bg-[#004856] hover:bg-[#003844] text-white cursor-pointer'
                    : 'bg-[#D6D9DE] text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>

              {/* Instant 1-Click Demo Fill */}
              <button
                type="button"
                onClick={handle1ClickDemo}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#004856]" />
                <span>1-Click Demo Login as Sudipta Samanta</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: OTP VERIFICATION SCREEN */}
        {/* ========================================================================= */}
        {currentStep === 'otp' && (
          <div className="flex-1 flex flex-col justify-between bg-white px-6 pt-5 pb-6">
            <div>
              <div className="flex items-center justify-between pb-3">
                <button
                  onClick={() => setCurrentStep('welcome')}
                  className="p-1 -ml-1 text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Sent Notice */}
              <h1 className="text-2xl font-extrabold text-slate-900 pt-2 tracking-tight">
                Verify OTP
              </h1>
              <p className="text-xs text-slate-500 pt-1 leading-relaxed">
                Enter the 4-digit code sent to <span className="font-bold text-slate-800">+91 {mobileNumber}</span> and <span className="font-bold text-slate-800">{selectedEmail}</span>
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* 4-Box OTP Input */}
              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-14 h-14 text-center text-2xl font-extrabold rounded-2xl border-2 border-slate-300 focus:border-[#004856] text-slate-900 focus:outline-none transition shadow-2xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500 font-medium">
                    Demo OTP: <strong className="text-[#004856]">4582</strong>
                  </span>

                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#004856] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Resend in <strong className="text-slate-700">{timer}s</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 space-y-3">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otpValues.join('').length < 4}
                className="w-full py-4 rounded-2xl bg-[#004856] hover:bg-[#003844] text-white font-bold text-base shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verify & Access Loan Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
