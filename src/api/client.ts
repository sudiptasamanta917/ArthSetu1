/**
 * Money View API Client Layer
 * Modular abstraction ready for future backend server connection.
 * Toggle `USE_MOCK_DATA = false` and set `BASE_URL` to connect to production REST APIs.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  statusCode: number;
}

export interface ApiConfig {
  baseUrl: string;
  useMockData: boolean;
  mockLatencyMs: number;
  apiKey?: string;
}

export const API_CONFIG: ApiConfig = {
  baseUrl: typeof window !== 'undefined' ? (window.location.origin + '/api') : 'https://api.moneyview.example.com/v1',
  useMockData: true,
  mockLatencyMs: 350,
};

// Local storage key helpers for frontend persistent mock state
export const STORAGE_KEYS = {
  USER_PROFILE: 'moneyview_user_profile',
  AUTH_TOKEN: 'moneyview_auth_token',
  LOAN_APPLICATIONS: 'moneyview_loan_applications',
  CIBIL_REPORT: 'moneyview_cibil_report',
  KYC_STATE: 'moneyview_kyc_state',
  INVESTMENT_PORTFOLIO: 'moneyview_investments',
  BOOKED_FDS: 'moneyview_booked_fds',
  NOTIFICATIONS: 'moneyview_notifications',
};

export async function mockDelay(ms: number = API_CONFIG.mockLatencyMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createApiResponse<T>(data: T, message: string = 'Success', statusCode: number = 200): ApiResponse<T> {
  return {
    success: statusCode >= 200 && statusCode < 300,
    data,
    message,
    timestamp: new Date().toISOString(),
    statusCode,
  };
}

export function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

export function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing to localStorage key "${key}":`, e);
  }
}

/**
 * Universal request handler: when backend is ready, standard fetch handles requests seamlessly.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (!API_CONFIG.useMockData) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();
    return json;
  }

  // Mock latency simulation
  await mockDelay();
  throw new Error(`Endpoint ${endpoint} not handled in mock mode`);
}
