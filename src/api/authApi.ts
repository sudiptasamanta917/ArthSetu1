import { UserProfile, EmploymentType } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay,
  API_CONFIG 
} from './client';

export interface RegisterPayload {
  fullName: string;
  phone: string;
  email: string;
  panNumber: string;
  employmentType: EmploymentType;
  monthlyIncome: number;
  pinCode: string;
  city?: string;
  state?: string;
}

export interface LoginPayload {
  phone: string;
  otp: string;
}

const DEFAULT_MOCK_USER: UserProfile = {
  id: 'usr_as_' + Math.random().toString(36).substring(2, 9),
  fullName: 'Sudipta Samanta',
  phone: '+918373041030',
  email: 'sudiptasamanta917@gmail.com',
  panNumber: 'ABCDE1234F',
  employmentType: 'salaried',
  monthlyIncome: 65000,
  pinCode: '700001',
  city: 'Kolkata',
  state: 'West Bengal',
  kycStatus: 'verified',
  kycDetails: {
    panNumber: 'ABCDE1234F',
    panVerified: true,
    aadhaarNumber: 'XXXX-XXXX-8921',
    aadhaarVerified: true,
    videoKycCompleted: true,
  },
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountNumber: '••••••••4892',
    ifscCode: 'HDFC0001234',
    accountHolder: 'Sudipta Samanta',
    isVerified: true,
  },
  creditScore: 785,
  isRegistered: true,
  createdAt: new Date().toISOString(),
  avatarUrl: '',
};

export const authApi = {
  /**
   * Send OTP to user's mobile number
   */
  async sendOtp(phone: string): Promise<ApiResponse<{ otpSent: boolean; validForSeconds: number; debugOtp: string }>> {
    await mockDelay(300);
    // In production, backend SMS gateway sends OTP
    return createApiResponse({
      otpSent: true,
      validForSeconds: 60,
      debugOtp: '4582', // standard demo OTP
    }, 'OTP sent successfully to ' + phone);
  },

  /**
   * Verify mobile OTP
   */
  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<{ verified: boolean; token: string }>> {
    await mockDelay(350);
    if (otp !== '4582' && otp.length !== 4 && otp !== '1234') {
      throw new Error('Invalid OTP. Use demo OTP "4582" or "1234" to proceed.');
    }
    const token = 'mv_jwt_token_' + Math.random().toString(36).substring(2);
    setLocalItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return createApiResponse({ verified: true, token }, 'Phone verified successfully');
  },

  /**
   * Register a new user profile
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<UserProfile>> {
    await mockDelay(600);
    
    // City resolution based on Pincode
    const city = payload.city || (payload.pinCode.startsWith('56') ? 'Bengaluru' : payload.pinCode.startsWith('11') ? 'New Delhi' : payload.pinCode.startsWith('40') ? 'Mumbai' : 'Kolkata');
    const state = payload.state || (payload.pinCode.startsWith('56') ? 'Karnataka' : payload.pinCode.startsWith('11') ? 'Delhi' : payload.pinCode.startsWith('40') ? 'Maharashtra' : 'West Bengal');

    const newUser: UserProfile = {
      id: 'usr_mv_' + Math.random().toString(36).substring(2, 9),
      fullName: payload.fullName,
      phone: payload.phone.startsWith('+91') ? payload.phone : `+91 ${payload.phone}`,
      email: payload.email,
      panNumber: payload.panNumber.toUpperCase(),
      employmentType: payload.employmentType,
      monthlyIncome: Number(payload.monthlyIncome),
      pinCode: payload.pinCode,
      city,
      state,
      kycStatus: 'in_progress',
      kycDetails: {
        panNumber: payload.panNumber.toUpperCase(),
        panVerified: true,
        aadhaarNumber: '',
        aadhaarVerified: false,
        videoKycCompleted: false,
      },
      creditScore: 780,
      isRegistered: true,
      createdAt: new Date().toISOString(),
    };

    setLocalItem(STORAGE_KEYS.USER_PROFILE, newUser);
    setLocalItem(STORAGE_KEYS.AUTH_TOKEN, 'mv_jwt_' + newUser.id);

    return createApiResponse(newUser, 'Registration completed successfully! Welcome to Money View.');
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile | null>> {
    await mockDelay(200);
    const stored = getLocalItem<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
    
    // Return stored user, or null if unauthenticated (or default user if wanted for demo)
    return createApiResponse(stored, stored ? 'Profile fetched' : 'No active session');
  },

  /**
   * Update user profile details
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    await mockDelay(300);
    const current = getLocalItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_MOCK_USER);
    const updated: UserProfile = { ...current, ...updates };
    setLocalItem(STORAGE_KEYS.USER_PROFILE, updated);
    return createApiResponse(updated, 'Profile updated successfully');
  },

  /**
   * Demo Quick Login helper
   */
  async quickDemoLogin(): Promise<ApiResponse<UserProfile>> {
    await mockDelay(300);
    setLocalItem(STORAGE_KEYS.USER_PROFILE, DEFAULT_MOCK_USER);
    setLocalItem(STORAGE_KEYS.AUTH_TOKEN, 'mv_demo_token_authenticated');
    return createApiResponse(DEFAULT_MOCK_USER, 'Logged in as Demo User');
  },

  /**
   * Log out
   */
  async logout(): Promise<ApiResponse<boolean>> {
    await mockDelay(200);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    // Keep user state or clear depending on preference
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    return createApiResponse(true, 'Logged out successfully');
  },
};
