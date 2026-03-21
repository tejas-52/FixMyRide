import { LucideIcon } from 'lucide-react';

export type UserRole = 'USER' | 'MECHANIC';

export type AppState = 
  | 'USER_HOME' 
  | 'USER_FINDING' 
  | 'USER_TRACKING' 
  | 'USER_ACTIVITY'
  | 'USER_VEHICLES'
  | 'USER_PROFILE'
  | 'MECHANIC_LIST' 
  | 'MECHANIC_NAV'
  | 'MECHANIC_ACTIVITY'
  | 'MECHANIC_GARAGE'
  | 'MECHANIC_PROFILE';

export interface ServiceType {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface Request {
  id: string;
  customerUid: string;
  customerName: string;
  customerPhoto: string;
  mechanicUid: string | null;
  distance: string;
  location: string;
  issueType: string;
  vehicle: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
}

export interface Vehicle {
  id: string;
  ownerUid: string;
  name: string;
  type: string;
  plate: string;
}

export interface Activity {
  id: string;
  userUid: string;
  date: string;
  service: string;
  cost: string;
  status: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: UserRole;
  createdAt: any;
}
