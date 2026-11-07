import fs from 'fs';
import path from 'path';
import {
  DEFAULT_FOUNDERS,
  DEFAULT_SITE_SETTINGS,
  INITIAL_PROPERTIES,
  INITIAL_TESTIMONIALS,
} from './constants';
import { isSupabaseConfigured, supabase } from './supabase';
import {
  BuyerEnquiry,
  ContactSubmission,
  Founder,
  Property,
  SellerEnquiry,
  SiteSettings,
  SiteVisitSchedule,
  Testimonial,
} from './types';

interface StoreData {
  properties: Property[];
  buyers: BuyerEnquiry[];
  sellers: SellerEnquiry[];
  testimonials: Testimonial[];
  contacts: ContactSubmission[];
  settings: SiteSettings;
  founders: Founder[];
  siteVisits: SiteVisitSchedule[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Memory cache
let inMemoryStore: StoreData | null = null;

function ensureDataFile(): StoreData {
  if (inMemoryStore) return inMemoryStore;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryStore = JSON.parse(content);
      return inMemoryStore!;
    }
  } catch (err) {
    console.error('Error reading store file, initializing defaults:', err);
  }

  // Initialize with authentic defaults
  inMemoryStore = {
    properties: [...INITIAL_PROPERTIES],
    buyers: [
      {
        id: 'BUY-101',
        name: 'Suresh Kumar',
        phone: '+91 94440 98765',
        email: 'suresh.kumar@outlook.com',
        category: 'Villas',
        preferredLocation: 'ECR, Chennai',
        alternativeLocations: 'OMR, Neelankarai',
        minBudget: 30000000,
        maxBudget: 45000000,
        requiredArea: '3000+ sq.ft',
        bedrooms: '4 BHK',
        bathrooms: '4+',
        purpose: 'Self-use',
        timeline: 'Immediate (Within 30 days)',
        fundingPreference: 'Self-funded',
        preferences: 'Gated community, sea-facing or walking distance to beach, Vaastu compliant',
        status: 'Site Visit Scheduled',
        assignedTo: 'Karthik Ramanathan',
        propertyId: 'MAG-101',
        propertyName: 'The Azure Haven – Coastal Luxury Villa',
        internalNotes: [
          {
            id: 'n-1',
            text: 'Client is an NRI returning to Chennai. Spoke on phone, very serious buyer.',
            author: 'Karthik Ramanathan',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'BUY-102',
        name: 'Ananya Raghavan',
        phone: '+91 98841 55432',
        email: 'ananya.r@gmail.com',
        category: 'Apartments',
        preferredLocation: 'OMR, Perungudi, Chennai',
        minBudget: 14000000,
        maxBudget: 18000000,
        requiredArea: '2000 sq.ft',
        bedrooms: '3 BHK',
        purpose: 'Self-use',
        timeline: '1 to 3 Months',
        fundingPreference: 'Home loan',
        status: 'Contacted',
        assignedTo: 'Sridhar M.',
        createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    sellers: [
      {
        id: 'SEL-201',
        posterType: 'Owner',
        name: 'Venkatesan G.',
        phone: '+91 98410 77665',
        email: 'venkat.g@yahoo.com',
        preferredContact: 'WhatsApp',
        propertyType: 'Independent Houses',
        listingType: 'Sale',
        location: 'Anna Nagar West, Chennai',
        fullAddress: 'Plot 18, 6th Avenue, Anna Nagar West, Chennai 600040',
        area: 4480,
        areaUnit: 'sq.ft',
        expectedPrice: 65000000,
        bedrooms: 5,
        description:
          'Independent 5 BHK house on 1.5 ground with clear Patta and CMDA approval. Ready for immediate documentation.',
        ownershipStatus: 'Sole Owner',
        documentAvailability: ['Patta', 'Parent Document (30 Years)', 'CMDA Plan Approval', 'EC Up to Date'],
        isListedElsewhere: 'No',
        timeline: '1-2 Months',
        status: 'Approved',
        convertedToPropertyId: 'MAG-103',
        assignedTo: 'Arun Balaji',
        internalNotes: [
          {
            id: 'n-2',
            text: 'Owner met in person. Documents verified. Listing onboarded as MAG-103.',
            author: 'Arun Balaji',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    testimonials: [...INITIAL_TESTIMONIALS],
    contacts: [
      {
        id: 'CNT-301',
        name: 'Premnath Iyer',
        phone: '+91 97910 22119',
        email: 'premnath@techcorp.in',
        category: 'Developer Partnership',
        message: 'We have an upcoming luxury plotted layout near Guduvanchery and would like to explore a mandate partnership with Maalon Realty.',
        status: 'New',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    settings: { ...DEFAULT_SITE_SETTINGS },
    founders: [...DEFAULT_FOUNDERS],
    siteVisits: [
      {
        id: 'sv-1',
        propertyId: 'MAG-101',
        propertyName: 'The Azure Haven – Coastal Luxury Villa',
        visitorName: 'Suresh Kumar',
        phone: '+91 94440 98765',
        email: 'suresh.kumar@outlook.com',
        preferredDate: '2026-11-08',
        preferredTime: '11:00 AM',
        status: 'Scheduled',
        assignedTo: 'Karthik Ramanathan',
        notes: 'VIP visit, arrange keys and villa caretaker access.',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  saveStoreData(inMemoryStore);
  return inMemoryStore;
}

function saveStoreData(data: StoreData): void {
  inMemoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store file:', err);
  }
}

// ================= PROPERTY OPERATIONS ================= //

export async function getProperties(filter?: {
  category?: string;
  location?: string;
  status?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}): Promise<Property[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (filter?.category) query = query.eq('category', filter.category);
      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.listingType) query = query.eq('listing_type', filter.listingType);
      if (filter?.featured !== undefined) query = query.eq('featured', filter.featured);
      const { data, error } = await query;
      if (!error && data) return data as Property[];
    } catch (e) {
      console.warn('Supabase query failed, falling back to local store:', e);
    }
  }

  const store = ensureDataFile();
  let list = [...store.properties];

  if (filter?.category && filter.category !== 'All') {
    list = list.filter((p) => p.category === filter.category);
  }
  if (filter?.status && filter.status !== 'All') {
    list = list.filter((p) => p.status === filter.status);
  }
  if (filter?.listingType && filter.listingType !== 'All') {
    list = list.filter((p) => (p.listingType || 'Sale') === filter.listingType);
  }
  if (filter?.location && filter.location.trim()) {
    const locLower = filter.location.toLowerCase();
    list = list.filter(
      (p) =>
        p.location.toLowerCase().includes(locLower) ||
        p.city.toLowerCase().includes(locLower) ||
        p.address.toLowerCase().includes(locLower)
    );
  }
  if (filter?.minPrice) {
    list = list.filter((p) => p.price >= filter.minPrice!);
  }
  if (filter?.maxPrice) {
    list = list.filter((p) => p.price <= filter.maxPrice!);
  }
  if (filter?.featured !== undefined) {
    list = list.filter((p) => p.featured === filter.featured);
  }

  return list;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const store = ensureDataFile();
  return store.properties.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const store = ensureDataFile();
  return store.properties.find((p) => p.id === id) || null;
}

export async function saveProperty(prop: Property): Promise<Property> {
  const store = ensureDataFile();
  const index = store.properties.findIndex((p) => p.id === prop.id);
  const now = new Date().toISOString();

  if (index >= 0) {
    store.properties[index] = { ...prop, updatedAt: now };
  } else {
    store.properties.unshift({ ...prop, createdAt: now, updatedAt: now });
  }

  saveStoreData(store);
  return prop;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const store = ensureDataFile();
  const initLength = store.properties.length;
  store.properties = store.properties.filter((p) => p.id !== id);
  const deleted = store.properties.length < initLength;
  if (deleted) saveStoreData(store);
  return deleted;
}

// ================= BUYER ENQUIRIES ================= //

export async function getBuyers(): Promise<BuyerEnquiry[]> {
  const store = ensureDataFile();
  return [...store.buyers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBuyerEnquiry(enquiry: Omit<BuyerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<BuyerEnquiry> {
  const store = ensureDataFile();
  const nextNum = store.buyers.length + 101;
  const newEnquiry: BuyerEnquiry = {
    ...enquiry,
    id: `BUY-${nextNum}`,
    status: 'New',
    createdAt: new Date().toISOString(),
    internalNotes: [],
  };

  store.buyers.unshift(newEnquiry);
  saveStoreData(store);
  return newEnquiry;
}

export async function updateBuyerStatus(id: string, status: BuyerEnquiry['status'], assignedTo?: string): Promise<BuyerEnquiry | null> {
  const store = ensureDataFile();
  const item = store.buyers.find((b) => b.id === id);
  if (!item) return null;

  item.status = status;
  if (assignedTo !== undefined) item.assignedTo = assignedTo;

  saveStoreData(store);
  return item;
}

export async function addBuyerNote(id: string, noteText: string, author: string): Promise<BuyerEnquiry | null> {
  const store = ensureDataFile();
  const item = store.buyers.find((b) => b.id === id);
  if (!item) return null;

  if (!item.internalNotes) item.internalNotes = [];
  item.internalNotes.push({
    id: `note-${Date.now()}`,
    text: noteText,
    author,
    timestamp: new Date().toISOString(),
  });

  saveStoreData(store);
  return item;
}

// ================= SELLER ENQUIRIES ================= //

export async function getSellers(): Promise<SellerEnquiry[]> {
  const store = ensureDataFile();
  return [...store.sellers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createSellerEnquiry(enquiry: Omit<SellerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<SellerEnquiry> {
  const store = ensureDataFile();
  const nextNum = store.sellers.length + 201;
  const newEnquiry: SellerEnquiry = {
    ...enquiry,
    posterType: enquiry.posterType || 'Owner',
    listingType: enquiry.listingType || 'Sale',
    id: `SEL-${nextNum}`,
    status: 'New',
    createdAt: new Date().toISOString(),
    internalNotes: [],
  };

  store.sellers.unshift(newEnquiry);
  saveStoreData(store);
  return newEnquiry;
}

export async function updateSellerStatus(id: string, status: SellerEnquiry['status'], assignedTo?: string): Promise<SellerEnquiry | null> {
  const store = ensureDataFile();
  const item = store.sellers.find((s) => s.id === id);
  if (!item) return null;

  item.status = status;
  if (assignedTo !== undefined) item.assignedTo = assignedTo;

  saveStoreData(store);
  return item;
}

export async function addSellerNote(id: string, noteText: string, author: string): Promise<SellerEnquiry | null> {
  const store = ensureDataFile();
  const item = store.sellers.find((s) => s.id === id);
  if (!item) return null;

  if (!item.internalNotes) item.internalNotes = [];
  item.internalNotes.push({
    id: `note-${Date.now()}`,
    text: noteText,
    author,
    timestamp: new Date().toISOString(),
  });

  saveStoreData(store);
  return item;
}

// ================= TESTIMONIALS ================= //

export async function getTestimonials(onlyApproved: boolean = true): Promise<Testimonial[]> {
  const store = ensureDataFile();
  let list = [...store.testimonials];
  if (onlyApproved) {
    list = list.filter((t) => t.approved);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createTestimonial(test: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>): Promise<Testimonial> {
  const store = ensureDataFile();
  const newTest: Testimonial = {
    ...test,
    id: `test-${Date.now()}`,
    approved: false, // Must be approved by admin!
    createdAt: new Date().toISOString(),
  };

  store.testimonials.unshift(newTest);
  saveStoreData(store);
  return newTest;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  const store = ensureDataFile();
  const index = store.testimonials.findIndex((t) => t.id === id);
  if (index === -1) return null;

  store.testimonials[index] = { ...store.testimonials[index], ...updates };
  saveStoreData(store);
  return store.testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const store = ensureDataFile();
  const len = store.testimonials.length;
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  const deleted = store.testimonials.length < len;
  if (deleted) saveStoreData(store);
  return deleted;
}

// ================= CONTACT SUBMISSIONS ================= //

export async function getContacts(): Promise<ContactSubmission[]> {
  const store = ensureDataFile();
  return [...store.contacts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContact(data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
  const store = ensureDataFile();
  const nextNum = store.contacts.length + 301;
  const newContact: ContactSubmission = {
    ...data,
    id: `CNT-${nextNum}`,
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  store.contacts.unshift(newContact);
  saveStoreData(store);
  return newContact;
}

export async function updateContactStatus(id: string, status: ContactSubmission['status']): Promise<ContactSubmission | null> {
  const store = ensureDataFile();
  const item = store.contacts.find((c) => c.id === id);
  if (!item) return null;
  item.status = status;
  saveStoreData(store);
  return item;
}

// ================= SITE VISITS ================= //

export async function getSiteVisits(): Promise<SiteVisitSchedule[]> {
  const store = ensureDataFile();
  return [...store.siteVisits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createSiteVisit(data: Omit<SiteVisitSchedule, 'id' | 'createdAt' | 'status'>): Promise<SiteVisitSchedule> {
  const store = ensureDataFile();
  const nextNum = store.siteVisits.length + 1;
  const visit: SiteVisitSchedule = {
    ...data,
    id: `SV-${nextNum}`,
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  };

  store.siteVisits.unshift(visit);
  saveStoreData(store);
  return visit;
}

// ================= SETTINGS & FOUNDERS ================= //

export async function getSettings(): Promise<SiteSettings> {
  const store = ensureDataFile();
  return store.settings;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = ensureDataFile();
  store.settings = { ...store.settings, ...settings };
  saveStoreData(store);
  return store.settings;
}

export async function getFounders(): Promise<Founder[]> {
  const store = ensureDataFile();
  return store.founders;
}

export async function updateFounder(id: string, updates: Partial<Founder>): Promise<Founder | null> {
  const store = ensureDataFile();
  const index = store.founders.findIndex((f) => f.id === id);
  if (index === -1) return null;
  store.founders[index] = { ...store.founders[index], ...updates };
  saveStoreData(store);
  return store.founders[index];
}
