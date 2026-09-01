import { KycStatus, UserKycDetails, UserBankDetails } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay 
} from './client';
import { authApi } from './authApi';

export interface KycState {
  status: KycStatus;
  currentStep: number; // 1: PAN, 2: Aadhaar, 3: Video/Selfie, 4: Bank Penny Drop
  panDetails: {
    panNumber: string;
    fullNameAsPerPan: string;
    dob: string;
    isVerified: boolean;
  };
  aadhaarDetails: {
    aadhaarNumber: string;
    otpSent: boolean;
    isVerified: boolean;
    address: string;
  };
  videoKyc: {
    selfieCaptured: boolean;
    faceMatchScore: number;
    isCompleted: boolean;
  };
  bankDetails: UserBankDetails;
}

const DEFAULT_KYC_STATE: KycState = {
  status: 'in_progress',
  currentStep: 2,
  panDetails: {
    panNumber: 'ABCDE1234F',
    fullNameAsPerPan: 'SUDIPTA ROY',
    dob: '1996-05-14',
    isVerified: true,
  },
  aadhaarDetails: {
    aadhaarNumber: '7829-4512-8921',
    otpSent: false,
    isVerified: false,
    address: '#42, 4th Cross, Indiranagar, Bengaluru, Karnataka 560038',
  },
  videoKyc: {
    selfieCaptured: false,
    faceMatchScore: 0,
    isCompleted: false,
  },
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50100482914892',
    ifscCode: 'HDFC0001234',
    accountHolder: 'Sudipta Roy',
    isVerified: true,
  },
};

export const kycApi = {
  /**
   * Get overall KYC state
   */
  async getKycState(): Promise<ApiResponse<KycState>> {
    await mockDelay(250);
    const kyc = getLocalItem<KycState>(STORAGE_KEYS.KYC_STATE, DEFAULT_KYC_STATE);
    return createApiResponse(kyc, 'KYC details retrieved');
  },

  /**
   * Step 1: Verify PAN Card with NSDL database
   */
  async verifyPan(panNumber: string, dob: string, fullName: string): Promise<ApiResponse<{ verified: boolean; nameOnPan: string }>> {
    await mockDelay(600);
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(panNumber)) {
      throw new Error('Please enter a valid 10-digit PAN format (e.g. ABCDE1234F)');
    }

    const state = getLocalItem<KycState>(STORAGE_KEYS.KYC_STATE, DEFAULT_KYC_STATE);
    state.panDetails = {
      panNumber: panNumber.toUpperCase(),
      fullNameAsPerPan: fullName.toUpperCase(),
      dob,
      isVerified: true,
    };
    state.currentStep = 2;
    setLocalItem(STORAGE_KEYS.KYC_STATE, state);

    return createApiResponse({
      verified: true,
      nameOnPan: fullName.toUpperCase(),
    }, 'PAN verified successfully with Income Tax Database');
  },

  /**
   * Step 2: Send Aadhaar OTP (DigiLocker / UIDAI)
   */
  async sendAadhaarOtp(aadhaarNumber: string): Promise<ApiResponse<{ otpSent: boolean; maskedMobile: string }>> {
    await mockDelay(500);
    const cleanNum = aadhaarNumber.replace(/\D/g, '');
    if (cleanNum.length !== 12) {
      throw new Error('Aadhaar must be a 12-digit valid number');
    }

    const state = getLocalItem<KycState>(STORAGE_KEYS.KYC_STATE, DEFAULT_KYC_STATE);
    state.aadhaarDetails.aadhaarNumber = cleanNum;
    state.aadhaarDetails.otpSent = true;
    setLocalItem(STORAGE_KEYS.KYC_STATE, state);

    return createApiResponse({
      otpSent: true,
      maskedMobile: 'XXXXXX4210',
    }, 'UIDAI OTP sent to your registered mobile number');
  },

  /**
   * Step 2.1: Verify Aadhaar OTP
   */
  async verifyAadhaarOtp(otp: string): Promise<ApiResponse<{ verified: boolean; address: string }>> {
    await mockDelay(600);
    if (otp !== '4582' && otp !== '1234' && otp.length !== 6 && otp.length !== 4) {
      throw new Error('Invalid UIDAI OTP. Use demo code "4582" or "1234".');
    }

    const state = getLocalItem<KycState>(STORAGE_KEYS.KYC_STATE, DEFAULT_KYC_STATE);
    state.aadhaarDetails.isVerified = true;
    state.currentStep = 3;
    setLocalItem(STORAGE_KEYS.KYC_STATE, state);

    return createApiResponse({
      verified: true,
      address: state.aadhaarDetails.address,
    }, 'Aadhaar e-KYC completed successfully via DigiLocker');
  },

  /**
   * Step 3: Complete live Selfie / Video KYC match
   */
  async completeVideoKyc(selfiePreviewUrl?: string): Promise<ApiResponse<{ matchScore: number; status: string }>> {
    await mockDelay(800);
    const state = getLocalItem<KycState>(STORAGE_KEYS.KYC_STATE, DEFAULT_KYC_STATE);
    state.videoKyc = {
      selfieCaptured: true,
      faceMatchScore: 98.4,
      isCompleted: true,
    };
    state.currentStep = 4;
    setLocalItem(STORAGE_KEYS.KYC_STATE, state);

    return createApiResponse({
      matchScore: 98.4,
      status: 'Face Match Confirmed (98.4% match with PAN/Aadhaar photo)',
    }, 'Live Video Selfie Verified');
  },

  /**
   * Step 4: Bank verification via ₹1 Penny Drop
   */
  async verifyBankPennyDrop(accountNumber: string, ifscCode: string, bankName: string, accountHolder: string): Promise<ApiResponse<UserBankDetails>> {
    await mockDelay(900);
    if (!accountNumber || accountNumber.length < 9) {
      throw new Error('Please provide a valid bank account number');
    }
    if (!ifscCode || ifscCode.length < 8) {
      throw new Error('Please enter a valid IFSC code (e.g. HDFC0001234)');
    }

    const bankDetails: UserBankDetails = {
      bankName: bankName || 'HDFC Bank Ltd',
      accountNumber: '••••••••' + accountNumber.slice(-4),
      ifscCode: ifscCode.toUpperCase(),
      accountHolder: accountHolder || 'SUDIPTA ROY',
      isVerified: true,
    };

    const state = getLocalItem<KycState>(STORAGE_KEYS.KYC_STATE, DEFAULT_KYC_STATE);
    state.bankDetails = bankDetails;
    state.status = 'verified';
    state.currentStep = 4;
    setLocalItem(STORAGE_KEYS.KYC_STATE, state);

    // Also sync to user profile
    await authApi.updateProfile({
      kycStatus: 'verified',
      bankDetails,
      kycDetails: {
        panNumber: state.panDetails.panNumber,
        panVerified: true,
        aadhaarNumber: state.aadhaarDetails.aadhaarNumber,
        aadhaarVerified: true,
        videoKycCompleted: true,
        verificationDate: new Date().toISOString(),
      },
    });

    return createApiResponse(bankDetails, '₹1.00 Penny deposited! Bank account verified instantly for direct loan disbursal & investments.');
  },
};
