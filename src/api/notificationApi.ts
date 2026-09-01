import { AppNotification } from '../types';
import { 
  ApiResponse, 
  createApiResponse, 
  getLocalItem, 
  setLocalItem, 
  STORAGE_KEYS, 
  mockDelay 
} from './client';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Pre-Approved Loan Ready! 🎉',
    message: 'You have a pre-approved personal loan offer of ₹5,00,000 at 1.33% p.m. Instant disbursal available.',
    type: 'loan',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'CIBIL Score Updated to 785',
    message: 'Your credit score is in the Excellent bracket. Next free refresh in 14 days.',
    type: 'cibil',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Complete Aadhaar KYC to unlock ₹10L limit',
    message: 'Paperless 1-minute DigiLocker Aadhaar verification is pending.',
    type: 'kyc',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: 'notif_4',
    title: 'Fixed Deposit Interest Rate Hike',
    message: 'Shriram Finance & Unity SFB revised FD rates up to 9.15% p.a.',
    type: 'fd',
    timestamp: '2 days ago',
    read: true,
  },
];

export const notificationApi = {
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    await mockDelay(150);
    const notifs = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return createApiResponse(notifs, 'Notifications fetched');
  },

  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    const notifs = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return createApiResponse(true, 'Marked as read');
  },

  async markAllAsRead(): Promise<ApiResponse<boolean>> {
    const notifs = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return createApiResponse(true, 'All marked as read');
  },
};
