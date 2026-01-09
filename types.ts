
export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  image: string;
  phone: string;
  email: string;
  sales: string;
  reviews: Review[];
}

export type ListingStatus = 'active' | 'sold' | 'on_show' | 'reduced' | 'new';

export interface Listing {
  id: string;
  title: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  garage: string; // e.g., "Single", "Double", "None"
  pool: 'private' | 'communal' | 'none';
  image: string;
  images: string[];
  agentId: string;
  description: string;
  isFeatured?: boolean;
  status: ListingStatus;
  propertyType: 'House' | 'Apartment' | 'Townhouse' | 'Commercial' | 'Land';
  isPetFriendly: boolean;
  viewingType: 'on_show' | 'appointment';
  onShowDate?: string; // e.g., "Sunday 14:00 - 17:00" or ISO string
}

export interface TourStop {
  id: string;
  title: string; // e.g., "Grand Foyer"
  description: string; // AI Generated description
  image: string; // Base64 or URL
  audioUrl?: string; // Pre-generated TTS audio (base64 data URL or cloud storage URL)
  timestamp: number;
}

// Voice presets for Google Cloud TTS
export type VoicePreset = 'JAMES' | 'OLIVIA';

export interface VirtualTour {
  id: string;
  title: string;
  agentId: string;
  listingId?: string; // Linked property
  stops: TourStop[];
  date: string;
  status: 'published' | 'draft';
  voicePreset?: VoicePreset; // Premium Google Cloud TTS voice
  voiceURI?: string; // Legacy browser TTS fallback
}

export interface Inquiry {
  id: string;
  listingId?: string;
  agentId?: string;
  customerName: string;
  customerEmail: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface Contractor {
  id: string;
  name: string;
  trade: string; // e.g., Plumbing, Electrical
  location: string;
  rating: number;
  image: string;
  phone: string;
  email: string;
  description: string;
  isVerified: boolean;
  hourlyRate?: number;
}

export interface Conveyancer {
  id: string;
  name: string;
  specialist: string; // e.g., "Property Transfers"
  location: string;
  rating: number;
  image: string;
  website: string;
  isVerified: boolean;
  phone: string;
}

export interface MaintenanceRequest {
  id: string;
  listingId: string;
  contractorId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  category: string; // e.g., Plumbing, Electrical, General
  reportedBy: string; // User/Agent who created it
  assignedTo?: string; // Contractor ID
  images?: string[];
  createdAt: string;
  updatedAt: string;
  estimatedCost?: number;
  actualCost?: number;
  completedAt?: string;
}

export enum AppView {
  HOME = 'HOME',
  LISTINGS = 'LISTINGS',
  AGENTS = 'AGENTS',
  AGENT_DETAILS = 'AGENT_DETAILS',
  TOUR_CREATOR = 'TOUR_CREATOR',
  ADMIN = 'ADMIN',
  CONVEYANCER = 'CONVEYANCER',
  MAINTENANCE = 'MAINTENANCE',
  AGENT_DASHBOARD = 'AGENT_DASHBOARD',
  MAINTENANCE_DASHBOARD = 'MAINTENANCE_DASHBOARD',
  CONTRACTOR_REGISTRATION = 'CONTRACTOR_REGISTRATION',
  JOIN_SELECTION = 'JOIN_SELECTION',
  REGISTER_AGENCY = 'REGISTER_AGENCY',
  REGISTER_AGENT = 'REGISTER_AGENT',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
  POPIA_COMPLIANCE = 'POPIA_COMPLIANCE',
  SERVICE_SHOW_PROPERTY = 'SERVICE_SHOW_PROPERTY',
  SERVICE_TOP_AREA_AGENT = 'SERVICE_TOP_AREA_AGENT',
  SERVICE_MAINTENANCE = 'SERVICE_MAINTENANCE',
  SERVICE_CONVEYANCING = 'SERVICE_CONVEYANCING',
  SERVICE_PARTNER_PORTAL = 'SERVICE_PARTNER_PORTAL',
  ONBOARDING = 'ONBOARDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

export type UserRole = 'AGENCY' | 'AGENT' | 'CONTRACTOR';

export type AdminView = 'OVERVIEW' | 'LISTINGS' | 'AGENTS' | 'LEADS' | 'VIRTUAL_TOURS' | 'MAINTENANCE' | 'CONVEYANCERS' | 'SETTINGS';
