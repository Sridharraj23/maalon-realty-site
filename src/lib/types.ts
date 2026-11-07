export type PropertyCategory =
  | 'Apartments'
  | 'Villas'
  | 'Independent Houses'
  | 'Residential Plots'
  | 'Commercial Properties';

export type PropertyStatus =
  | 'Available'
  | 'Under Negotiation'
  | 'Sold'
  | 'Unavailable';

export type ListingType = 'Sale' | 'Rent';

export interface Property {
  id: string; // e.g. "MAG-001"
  title: string;
  slug: string;
  category: PropertyCategory;
  listingType: ListingType; // 'Sale' or 'Rent'
  status: PropertyStatus;
  price: number; // in INR (total for Sale, or monthly rent for Rent)
  pricePerSqFt?: number;
  area: number;
  areaUnit: 'sq.ft' | 'grounds' | 'acres' | 'cents';
  city: string;
  location: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: string;
  facing?: string;
  furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  possession?: string;
  featured: boolean;
  verified: boolean;
  images: string[];
  primaryImage: string;
  description: string;
  features: string[];
  nearbyFacilities?: { name: string; distance: string }[];
  reraId?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Property Matched'
  | 'Site Visit Scheduled'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export interface InternalNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface BuyerEnquiry {
  id: string; // e.g. "BUY-101"
  name: string;
  phone: string;
  email: string;
  category: PropertyCategory;
  listingType?: ListingType;
  preferredLocation: string;
  alternativeLocations?: string;
  minBudget: number;
  maxBudget: number;
  requiredArea?: string;
  bedrooms?: string;
  bathrooms?: string;
  purpose: 'Self-use' | 'Investment' | 'Business';
  timeline: 'Immediate (Within 30 days)' | '1 to 3 Months' | '3 to 6 Months' | 'Exploring';
  fundingPreference: 'Self-funded' | 'Home loan' | 'Exploring options';
  preferences?: string;
  status: LeadStatus;
  assignedTo?: string;
  internalNotes?: InternalNote[];
  propertyId?: string;
  propertyName?: string;
  createdAt: string;
}

export type SellerStatus =
  | 'New'
  | 'Reviewed'
  | 'Owner Contacted'
  | 'Verification In-Progress'
  | 'Approved'
  | 'Rejected';

export interface SellerEnquiry {
  id: string; // e.g. "SEL-201"
  posterType: 'Owner' | 'Dealer'; // Checkbox / selector for owner vs dealer
  name: string;
  phone: string;
  email: string;
  preferredContact: 'Phone Call' | 'WhatsApp' | 'Email';
  propertyType: PropertyCategory;
  listingType: ListingType; // Sale or Rent
  location: string;
  fullAddress: string;
  area: number;
  areaUnit: 'sq.ft' | 'grounds' | 'acres' | 'cents';
  expectedPrice: number;
  bedrooms?: number;
  description: string;
  ownershipStatus: 'Sole Owner' | 'Joint Ownership' | 'Inherited' | 'Power of Attorney';
  documentAvailability?: string[];
  isListedElsewhere: 'Yes' | 'No';
  timeline: 'Immediate' | '1-2 Months' | 'Within 6 Months' | 'Flexible';
  remarks?: string;
  images?: string[];
  status: SellerStatus;
  convertedToPropertyId?: string;
  assignedTo?: string;
  internalNotes?: InternalNote[];
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  transactionType: 'Buyer' | 'Seller' | 'Investor' | 'Commercial Client';
  propertyLocation: string;
  rating: number; // 1-5
  content: string;
  photoUrl?: string;
  videoUrl?: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
}

export interface ContactSubmission {
  id: string; // e.g. "CNT-301"
  name: string;
  phone: string;
  email: string;
  category:
    | 'Buying a Property'
    | 'Selling a Property'
    | 'Rental / Lease'
    | 'Developer Partnership'
    | 'Broker Partnership'
    | 'General Enquiry';
  message: string;
  status: 'New' | 'Replied' | 'Resolved';
  createdAt: string;
}

export interface Founder {
  id: string;
  name: string;
  designation: string;
  role: string;
  bio: string;
  image: string;
  areasOfResponsibility: string[];
  email?: string;
  linkedin?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  mission: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  reraNumber: string;
  socials: {
    instagram: string;
    linkedin: string;
    youtube: string;
    facebook?: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
}

export interface SiteVisitSchedule {
  id: string;
  propertyId: string;
  propertyName: string;
  visitorName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
}
