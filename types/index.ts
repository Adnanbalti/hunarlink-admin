export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'CONSUMER' | 'PROVIDER';
  isActive: boolean;
  createdAt: string;
}

export interface Provider {
  id: string;
  user: User;
  skill: string;        
  skills?: string[];    
  city: string;
  hourlyRate: number;
  bio: string;
  isVerified: boolean;
}

export interface Booking {
  id: string;
  consumer: User;
  provider: Provider;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
}

export interface Review {
  id: string;
  consumer: User;
  provider: Provider;
  rating: number;
  comment: string;
  createdAt: string;
}