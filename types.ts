export type Role = 'SUPER_ADMIN' | 'MARKET_ADMIN' | 'COUNTER_STAFF' | 'VENDOR' | 'SUPPLIER' | 'USER';

export interface UserSettings {
  lowStockThreshold: number;
  criticalStockThreshold: number;
  notifications: {
    email: boolean;
    browser: boolean;
    sms: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'NONE';
  mfaEnabled: boolean;
  profileImage?: string;
  appliedRole?: Role;
  settings?: UserSettings;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  products: number;
  joinedDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  city: string;
  market: string;
  rentDue: number;
  level?: string;
  section?: string;
  storeType?: 'STALL' | 'KIOSK' | 'SHOP' | 'WAREHOUSE';
  ownershipType?: 'LEASED' | 'OWNED' | 'SUB-LEASED';
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  warehouseLocation: string;
  suppliedItemsCount: number;
  rating: number;
  onboardingDate: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  vendor: string;
  stock: number;
  price: number;
  status: 'HEALTHY' | 'LOW' | 'CRITICAL' | 'PENDING_APPROVAL';
  category: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'RENT' | 'SERVICE_CHARGE' | 'LICENSE' | 'WITHDRAWAL' | 'SUPPLY_PAYMENT';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  method: string;
}

export interface Market {
  id: string;
  name: string;
  city: string;
  type: 'WHOLESALE' | 'RETAIL' | 'MIXED';
  ownership: 'PUBLIC' | 'PRIVATE' | 'PPP';
  establishedDate: string;
  primaryProducts: string[];
  capacity: number;
}

export interface StockLog {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  vendor: string;
  type: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  inspector: string;
  status: 'VERIFIED' | 'FLAGGED' | 'PENDING';
}

export interface CityMarketData {
  city: string;
  markets: string[];
}