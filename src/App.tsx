/**
 * ArthSetu Financial Services Hub
 * Modern financial application with instant personal & business loans,
 * free CIBIL credit score analysis, paperless digital KYC, investments & high-return FDs.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { SidebarDrawer } from './components/layout/SidebarDrawer';
import { ArthSetuLogo } from './components/common/ArthSetuLogo';

// Dedicated Page Components
import { HomePage } from './pages/HomePage';
import { PersonalLoanPage } from './pages/PersonalLoanPage';
import { BusinessLoanPage } from './pages/BusinessLoanPage';
import { CibilScorePage } from './pages/CibilScorePage';
import { FixedDepositPage } from './pages/FixedDepositPage';
import { InvestmentPage } from './pages/InvestmentPage';
import { KycVerificationPage } from './pages/KycVerificationPage';
import { ApplicationsPage } from './pages/ApplicationsPage';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { CibilScoreModal } from './components/features/CibilScoreModal';
import { KycVerificationModal } from './components/features/KycVerificationModal';
import { PersonalLoanModal } from './components/features/PersonalLoanModal';
import { BusinessLoanModal } from './components/features/BusinessLoanModal';
import { FixedDepositModal } from './components/features/FixedDepositModal';
import { InvestmentModal } from './components/features/InvestmentModal';
import { ProfileModal } from './components/features/ProfileModal';
import { ApiConfigModal } from './components/features/ApiConfigModal';
import { ReferAndEarnModal } from './components/modals/ReferAndEarnModal';
import { AcoinsZoneModal } from './components/modals/AcoinsZoneModal';

import { 
  authApi, 
  loanApi, 
  notificationApi 
} from './api';
import { 
  UserProfile, 
  LoanApplication, 
  AppNotification, 
  AppPage
} from './types';
import { 
  ArrowLeft,
  ChevronRight,
  Home
} from 'lucide-react';

export default function App() {
  // Global App States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedLoanAmount, setSelectedLoanAmount] = useState<number>(250000);
  const [selectedLoanTenure, setSelectedLoanTenure] = useState<number>(24);

  // Modal & Drawer Open States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPersonalLoanOpen, setIsPersonalLoanOpen] = useState(false);
  const [isBusinessLoanOpen, setIsBusinessLoanOpen] = useState(false);
  const [isCibilOpen, setIsCibilOpen] = useState(false);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isFdOpen, setIsFdOpen] = useState(false);
  const [isInvestmentOpen, setIsInvestmentOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReferAndEarnOpen, setIsReferAndEarnOpen] = useState(false);
  const [isAcoinsZoneOpen, setIsAcoinsZoneOpen] = useState(false);

  // Initialize App on Mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // 1. Fetch Profile
      const profileRes = await authApi.getProfile();
      if (profileRes.data) {
        setUser(profileRes.data);
      } else {
        // Automatically preload demo profile for smooth immediate exploration
        const demoRes = await authApi.quickDemoLogin();
        setUser(demoRes.data);
      }

      // 2. Fetch User Loans
      const loansRes = await loanApi.getUserLoans();
      setLoans(loansRes.data);

      // 3. Fetch Notifications
      const notifsRes = await notificationApi.getNotifications();
      setNotifications(notifsRes.data);
    } catch (error) {
      console.error('Failed to load initial financial data:', error);
    }
  };

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle successful registration or login
  const handleAuthSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    loadInitialData();
  };

  // Handle logout
  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
    setLoans([]);
    setCurrentPage('home');
  };

  // Loan applied callback
  const handleLoanApplied = (newLoan: LoanApplication) => {
    setLoans((prev) => [newLoan, ...prev]);
    setCurrentPage('applications');
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Notification click routing
  const handleSelectNotification = (notif: AppNotification) => {
    setIsNotificationsOpen(false);
    if (notif.type === 'loan') setCurrentPage('applications');
    else if (notif.type === 'cibil') setCurrentPage('cibil');
    else if (notif.type === 'kyc') setCurrentPage('kyc');
    else if (notif.type === 'fd') setCurrentPage('fixed_deposits');
    else if (notif.type === 'investment') setCurrentPage('investments');
    else setCurrentPage('home');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const PAGE_TITLES: Record<AppPage, string> = {
    home: 'Home Dashboard',
    personal_loans: 'Instant Personal Loans',
    business_loans: 'SME & Business Loans',
    cibil: 'Free CIBIL Credit Bureau Report',
    fixed_deposits: 'High-Yield Fixed Deposits',
    investments: 'Mutual Funds & 24K Digital Gold',
    kyc: 'Paperless Digital e-KYC Verification',
    applications: 'My Applications & Disbursal Tracker',
  };

  return (
    <div className="min-h-screen bg-[#E2ECEE] text-slate-900 flex justify-center selection:bg-[#004856] selection:text-white sm:py-4">
      {/* Mobile Device Canvas Wrapper */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[92vh] bg-[#F0F8FA] flex flex-col shadow-2xl relative sm:rounded-3xl sm:border sm:border-slate-300/80 overflow-hidden">
        {/* Simulated Phone Status Bar matching Screenshot 1 & 2 */}
        <div className="bg-[#003844] text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight select-none shrink-0 border-b border-[#034452]">
          <span className="font-semibold tracking-normal">08:23:52</span>
          <div className="flex items-center gap-2 text-[10px] text-cyan-100">
            <span className="text-[9px] bg-cyan-900/70 px-1 py-0.2 rounded border border-cyan-700/60 font-mono">VoLTE</span>
            <span className="font-semibold">4G</span>
            <span>📶</span>
            <div className="flex items-center gap-1">
              <span>57%</span>
              <div className="w-4 h-2 border border-white/90 rounded-xs p-0.2 flex items-center">
                <div className="w-2.5 h-1 bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Header with Brand Logo, Acoins Badge, and Hamburger Menu */}
        <Navbar
          user={user}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenKyc={() => handleNavigate('kyc')}
          onOpenCibil={() => handleNavigate('cibil')}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenApiConfig={() => setIsApiConfigOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenAcoinsZone={() => setIsAcoinsZoneOpen(true)}
          unreadNotificationsCount={unreadCount}
        />

        {/* Main Container Content */}
        <main className="flex-1 w-full px-3.5 py-3.5 space-y-4 overflow-y-auto">
          {/* Breadcrumb Navigation when not on Home */}
          {currentPage !== 'home' && (
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <button
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-1 hover:text-[#004856] font-medium transition cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-bold text-slate-800 truncate max-w-[170px]">{PAGE_TITLES[currentPage]}</span>
              </div>

              <button
                onClick={() => handleNavigate('home')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            </div>
          )}

          {/* 1. Page View Switching based on currentPage */}
          {currentPage === 'home' && (
            <HomePage
              user={user}
              loans={loans}
              onNavigateToPersonalLoan={() => handleNavigate('personal_loans')}
              onNavigateToBusinessLoan={() => handleNavigate('business_loans')}
              onNavigateToCibil={() => handleNavigate('cibil')}
              onNavigateToKyc={() => handleNavigate('kyc')}
              onNavigateToFd={() => handleNavigate('fixed_deposits')}
              onNavigateToInvestments={() => handleNavigate('investments')}
              onNavigateToApplications={() => handleNavigate('applications')}
              onOpenReferAndEarn={() => setIsReferAndEarnOpen(true)}
              onOpenAcoinsZone={() => setIsAcoinsZoneOpen(true)}
              onOpenApiConfig={() => setIsApiConfigOpen(true)}
              onSelectEmiValues={(amount, tenure) => {
                setSelectedLoanAmount(amount);
                setSelectedLoanTenure(tenure);
              }}
            />
          )}

          {currentPage === 'personal_loans' && (
            <PersonalLoanPage
              user={user}
              initialAmount={selectedLoanAmount}
              initialTenure={selectedLoanTenure}
              onLoanApplied={handleLoanApplied}
              onNavigateToKyc={() => handleNavigate('kyc')}
            />
          )}

          {currentPage === 'business_loans' && (
            <BusinessLoanPage
              user={user}
              onLoanApplied={handleLoanApplied}
              onNavigateToKyc={() => handleNavigate('kyc')}
            />
          )}

          {currentPage === 'cibil' && (
            <CibilScorePage
              user={user}
              onNavigateToPersonalLoan={() => handleNavigate('personal_loans')}
              onNavigateToFd={() => handleNavigate('fixed_deposits')}
            />
          )}

          {currentPage === 'fixed_deposits' && (
            <FixedDepositPage
              user={user}
              onNavigateToInvestments={() => handleNavigate('investments')}
            />
          )}

          {currentPage === 'investments' && (
            <InvestmentPage
              user={user}
            />
          )}

          {currentPage === 'kyc' && (
            <KycVerificationPage
              user={user}
              onKycVerified={(updatedUser) => {
                setUser(updatedUser);
              }}
              onNavigateToLoans={() => handleNavigate('personal_loans')}
            />
          )}

          {currentPage === 'applications' && (
            <ApplicationsPage
              user={user}
              loans={loans}
              onNavigateToPersonalLoan={() => handleNavigate('personal_loans')}
              onNavigateToBusinessLoan={() => handleNavigate('business_loans')}
              onNavigateToKyc={() => handleNavigate('kyc')}
            />
          )}
        </main>

        {/* Bottom Android System Navigation Bar matching Screenshot 2 */}
        <div className="bg-[#F0F8FA] border-t border-slate-200/70 py-2 px-8 flex items-center justify-between text-slate-400 select-none shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:text-slate-700 transition cursor-pointer"
            title="Menu / Drawer"
          >
            <div className="space-y-0.5 w-4">
              <div className="h-0.5 bg-current rounded-full" />
              <div className="h-0.5 bg-current rounded-full" />
              <div className="h-0.5 bg-current rounded-full" />
            </div>
          </button>

          <button 
            onClick={() => handleNavigate('home')}
            className="p-2 hover:text-slate-700 transition cursor-pointer"
            title="Home"
          >
            <div className="w-3.5 h-3.5 rounded-xs border-2 border-current" />
          </button>

          <button 
            onClick={() => handleNavigate('home')}
            className="p-2 hover:text-slate-700 transition cursor-pointer"
            title="Back"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Drawer matching Screenshot 2 */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenKyc={() => handleNavigate('kyc')}
        onOpenCibil={() => handleNavigate('cibil')}
        onOpenApiConfig={() => setIsApiConfigOpen(true)}
        onOpenReferAndEarn={() => setIsReferAndEarnOpen(true)}
        onOpenAcoinsZone={() => setIsAcoinsZoneOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* CIBIL Credit Score Modal */}
      <CibilScoreModal
        isOpen={isCibilOpen}
        onClose={() => setIsCibilOpen(false)}
        onApplyPersonalLoan={() => {
          setIsCibilOpen(false);
          handleNavigate('personal_loans');
        }}
      />

      {/* Digital KYC Modal */}
      <KycVerificationModal
        isOpen={isKycOpen}
        onClose={() => setIsKycOpen(false)}
        user={user}
        onKycCompleted={() => {
          loadInitialData();
        }}
      />

      {/* Personal Loan Application Modal */}
      <PersonalLoanModal
        isOpen={isPersonalLoanOpen}
        onClose={() => setIsPersonalLoanOpen(false)}
        user={user}
        initialAmount={selectedLoanAmount}
        initialTenure={selectedLoanTenure}
        onLoanApplied={handleLoanApplied}
      />

      {/* Business Loan Application Modal */}
      <BusinessLoanModal
        isOpen={isBusinessLoanOpen}
        onClose={() => setIsBusinessLoanOpen(false)}
        user={user}
        onLoanApplied={handleLoanApplied}
      />

      {/* Fixed Deposit Booking Modal */}
      <FixedDepositModal
        isOpen={isFdOpen}
        onClose={() => setIsFdOpen(false)}
        user={user}
        onFdBooked={() => {
          loadInitialData();
        }}
      />

      {/* Investment & 24K Gold Modal */}
      <InvestmentModal
        isOpen={isInvestmentOpen}
        onClose={() => setIsInvestmentOpen(false)}
        user={user}
        onInvestmentAdded={() => {
          loadInitialData();
        }}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={handleLogout}
        onOpenKyc={() => {
          setIsProfileOpen(false);
          handleNavigate('kyc');
        }}
        onOpenCibil={() => {
          setIsProfileOpen(false);
          handleNavigate('cibil');
        }}
        onOpenApiConfig={() => {
          setIsProfileOpen(false);
          setIsApiConfigOpen(true);
        }}
      />

      {/* API Config & Separated Backend Modal */}
      <ApiConfigModal
        isOpen={isApiConfigOpen}
        onClose={() => setIsApiConfigOpen(false)}
      />

      {/* Refer & Earn Modal matching Screenshot 3 */}
      <ReferAndEarnModal
        isOpen={isReferAndEarnOpen}
        onClose={() => setIsReferAndEarnOpen(false)}
        user={user}
      />

      {/* Acoins Zone Modal matching Screenshot 3 */}
      <AcoinsZoneModal
        isOpen={isAcoinsZoneOpen}
        onClose={() => setIsAcoinsZoneOpen(false)}
        user={user}
        onNavigateToInvestments={() => {
          setIsAcoinsZoneOpen(false);
          handleNavigate('investments');
        }}
      />
    </div>
  );
}

