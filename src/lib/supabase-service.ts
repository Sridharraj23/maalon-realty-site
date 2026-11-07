import { supabase, isSupabaseConfigured } from './supabase';
import {
  BuyerEnquiry,
  ContactSubmission,
  Property,
  SellerEnquiry,
  SiteSettings,
  SiteVisitSchedule,
  Testimonial,
} from './types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_PROPERTIES,
  INITIAL_TESTIMONIALS,
} from './constants';

// Local storage key for client-side persistence of fallback inquiries and admin auth
const STORAGE_PREFIX = 'maalon_';

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore storage quota
  }
}

// ----------------------------------------------------------------------
// 1. PROPERTIES
// ----------------------------------------------------------------------
export async function getProperties(filter?: {
  category?: string;
  listingType?: string;
  status?: string;
  featured?: boolean;
}): Promise<Property[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('properties').select('*');

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }
      if (filter?.category && filter.category !== 'All') {
        query = query.eq('category', filter.category);
      }
      if (filter?.listingType && filter.listingType !== 'All') {
        query = query.eq('listing_type', filter.listingType);
      }
      if (filter?.featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        // Map snake_case to camelCase if needed
        return data.map(mapDbToProperty);
      }
    }
  } catch (err) {
    console.warn('Supabase properties fetch error, falling back to defaults:', err);
  }

  // Fallback to in-code verified properties
  let results = [...INITIAL_PROPERTIES];
  if (filter?.status) {
    results = results.filter((p) => p.status === filter.status);
  }
  if (filter?.category && filter.category !== 'All') {
    results = results.filter((p) => p.category === filter.category);
  }
  if (filter?.listingType && filter.listingType !== 'All') {
    results = results.filter((p) => p.listingType === filter.listingType);
  }
  if (filter?.featured) {
    results = results.filter((p) => p.featured);
  }
  return results;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return mapDbToProperty(data);
      }
    }
  } catch {
    // fallback
  }

  const found = INITIAL_PROPERTIES.find((p) => p.slug === slug);
  return found || null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return mapDbToProperty(data);
      }
    }
  } catch {
    // fallback
  }

  const found = INITIAL_PROPERTIES.find((p) => p.id === id);
  return found || null;
}

export async function createProperty(prop: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  const newId = `MAG-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();
  const newProp: Property = {
    ...prop,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('properties').insert([mapPropertyToDb(newProp)]);
    } catch (e) {
      console.error('Error inserting property to Supabase:', e);
    }
  }

  return newProp;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured && supabase) {
    try {
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.price) dbUpdates.price = updates.price;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      dbUpdates.updated_at = now;

      await supabase.from('properties').update(dbUpdates).eq('id', id);
    } catch (e) {
      console.error('Error updating property in Supabase:', e);
    }
  }

  const existing = await getPropertyById(id);
  if (!existing) return null;
  return { ...existing, ...updates, updatedAt: now };
}

export async function deleteProperty(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('properties').delete().eq('id', id);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

// ----------------------------------------------------------------------
// 2. BUYER ENQUIRIES
// ----------------------------------------------------------------------
export async function submitBuyerEnquiry(
  data: Omit<BuyerEnquiry, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; id: string; error?: string }> {
  const id = `BUY-${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();
  const enquiry: BuyerEnquiry = {
    ...data,
    id,
    status: 'New',
    createdAt: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('buyers').insert([
        {
          id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          category: data.category,
          listing_type: data.listingType || 'Sale',
          preferred_location: data.preferredLocation,
          alternative_locations: data.alternativeLocations || '',
          min_budget: data.minBudget,
          max_budget: data.maxBudget,
          required_area: data.requiredArea || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          purpose: data.purpose || 'Self-use',
          timeline: data.timeline || 'Exploring',
          funding_preference: data.fundingPreference || 'Exploring options',
          preferences: data.preferences || '',
          status: 'New',
          property_id: data.propertyId || null,
          property_name: data.propertyName || null,
          created_at: now,
        },
      ]);

      if (error) {
        console.warn('Supabase buyer enquiry insert error:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase buyer enquiry exception:', err);
    }
  }

  // Also cache locally
  const buyers = getLocal<BuyerEnquiry[]>('buyers', []);
  setLocal('buyers', [enquiry, ...buyers]);

  return { success: true, id };
}

export async function getBuyerEnquiries(): Promise<BuyerEnquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((b) => ({
          id: b.id,
          name: b.name,
          phone: b.phone,
          email: b.email,
          category: b.category,
          listingType: b.listing_type || 'Sale',
          preferredLocation: b.preferred_location,
          alternativeLocations: b.alternative_locations,
          minBudget: Number(b.min_budget),
          maxBudget: Number(b.max_budget),
          requiredArea: b.required_area,
          bedrooms: b.bedrooms,
          bathrooms: b.bathrooms,
          purpose: b.purpose,
          timeline: b.timeline,
          fundingPreference: b.funding_preference,
          preferences: b.preferences,
          status: b.status,
          propertyId: b.property_id,
          propertyName: b.property_name,
          createdAt: b.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocal<BuyerEnquiry[]>('buyers', []);
}

// ----------------------------------------------------------------------
// 3. SELLER ENQUIRIES
// ----------------------------------------------------------------------
export async function submitSellerEnquiry(
  data: Omit<SellerEnquiry, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; id: string; error?: string }> {
  const id = `SEL-${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();
  const enquiry: SellerEnquiry = {
    ...data,
    id,
    status: 'New',
    createdAt: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('sellers').insert([
        {
          id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          poster_type: data.posterType || 'Owner',
          preferred_contact: data.preferredContact || 'Phone Call',
          property_type: data.propertyType,
          listing_type: data.listingType || 'Sale',
          location: data.location,
          full_address: data.fullAddress,
          area: data.area,
          area_unit: data.areaUnit || 'sq.ft',
          expected_price: data.expectedPrice,
          bedrooms: data.bedrooms || null,
          description: data.description || '',
          ownership_status: data.ownershipStatus || 'Sole Owner',
          document_availability: data.documentAvailability || [],
          is_listed_elsewhere: data.isListedElsewhere || 'No',
          timeline: data.timeline || 'Flexible',
          remarks: data.remarks || '',
          images: data.images || [],
          status: 'New',
          created_at: now,
        },
      ]);

      if (error) {
        console.warn('Supabase seller enquiry insert error:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase seller enquiry exception:', err);
    }
  }

  // Cache locally
  const sellers = getLocal<SellerEnquiry[]>('sellers', []);
  setLocal('sellers', [enquiry, ...sellers]);

  return { success: true, id };
}

export async function getSellerEnquiries(): Promise<SellerEnquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          posterType: s.poster_type || 'Owner',
          name: s.name,
          phone: s.phone,
          email: s.email,
          preferredContact: s.preferred_contact,
          propertyType: s.property_type,
          listingType: s.listing_type || 'Sale',
          location: s.location,
          fullAddress: s.full_address,
          area: Number(s.area),
          areaUnit: s.area_unit,
          expectedPrice: Number(s.expected_price),
          bedrooms: s.bedrooms,
          description: s.description,
          ownershipStatus: s.ownership_status,
          documentAvailability: s.document_availability,
          isListedElsewhere: s.is_listed_elsewhere,
          timeline: s.timeline,
          remarks: s.remarks,
          images: s.images,
          status: s.status,
          createdAt: s.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocal<SellerEnquiry[]>('sellers', []);
}

// ----------------------------------------------------------------------
// 4. CONTACT & SITE VISITS
// ----------------------------------------------------------------------
export async function submitContactSubmission(data: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; id: string }> {
  const id = `CNT-${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contact_submissions').insert([
        {
          id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          subject: data.subject,
          message: data.message,
          created_at: now,
        },
      ]);
    } catch (e) {
      console.warn('Supabase contact submission error:', e);
    }
  }

  return { success: true, id };
}

export async function scheduleSiteVisit(data: {
  propertyId: string;
  propertyTitle: string;
  visitorName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}): Promise<{ success: boolean; id: string }> {
  const id = `VIS-${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('site_visits').insert([
        {
          id,
          property_id: data.propertyId,
          property_title: data.propertyTitle,
          visitor_name: data.visitorName,
          phone: data.phone,
          email: data.email,
          preferred_date: data.preferredDate,
          preferred_time: data.preferredTime,
          notes: data.notes || '',
          status: 'Scheduled',
          created_at: now,
        },
      ]);
    } catch (e) {
      console.warn('Supabase site visit error:', e);
    }
  }

  return { success: true, id };
}

// ----------------------------------------------------------------------
// 5. TESTIMONIALS
// ----------------------------------------------------------------------
export async function getTestimonials(onlyApproved = true): Promise<Testimonial[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('testimonials').select('*');
      if (onlyApproved) {
        query = query.eq('approved', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          phone: t.phone,
          transactionType: t.transaction_type,
          propertyLocation: t.property_location,
          rating: t.rating,
          content: t.content,
          photoUrl: t.photo_url,
          videoUrl: t.video_url,
          approved: t.approved,
          featured: t.featured,
          createdAt: t.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  return onlyApproved
    ? INITIAL_TESTIMONIALS.filter((t) => t.approved)
    : INITIAL_TESTIMONIALS;
}

export async function submitTestimonial(
  data: Omit<Testimonial, 'id' | 'approved' | 'featured' | 'createdAt'>
): Promise<{ success: boolean; id: string }> {
  const id = `TST-${Date.now().toString().slice(-5)}`;
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('testimonials').insert([
        {
          id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          transaction_type: data.transactionType,
          property_location: data.propertyLocation,
          rating: data.rating,
          content: data.content,
          photo_url: data.photoUrl,
          video_url: data.videoUrl,
          approved: false,
          featured: false,
          created_at: now,
        },
      ]);
    } catch (e) {
      console.warn('Supabase testimonial insert error:', e);
    }
  }

  return { success: true, id };
}

// ----------------------------------------------------------------------
// 6. SITE SETTINGS
// ----------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  return DEFAULT_SITE_SETTINGS;
}

// ----------------------------------------------------------------------
// Helper Mappers
// ----------------------------------------------------------------------
function mapDbToProperty(db: any): Property {
  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    category: db.category,
    listingType: db.listing_type || 'Sale',
    status: db.status || 'Available',
    price: Number(db.price),
    pricePerSqFt: db.price_per_sqft ? Number(db.price_per_sqft) : undefined,
    area: Number(db.area),
    areaUnit: db.area_unit || 'sq.ft',
    city: db.city || 'Chennai',
    location: db.location,
    address: db.address,
    bedrooms: db.bedrooms ? Number(db.bedrooms) : undefined,
    bathrooms: db.bathrooms ? Number(db.bathrooms) : undefined,
    parking: db.parking,
    facing: db.facing,
    furnishing: db.furnishing,
    possession: db.possession,
    featured: Boolean(db.featured),
    verified: Boolean(db.verified),
    primaryImage: db.primary_image,
    images: Array.isArray(db.images) ? db.images : [],
    description: db.description,
    features: Array.isArray(db.features) ? db.features : [],
    nearbyFacilities: Array.isArray(db.nearby_facilities) ? db.nearby_facilities : [],
    reraId: db.rera_id,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function mapPropertyToDb(prop: Property): any {
  return {
    id: prop.id,
    title: prop.title,
    slug: prop.slug,
    category: prop.category,
    listing_type: prop.listingType || 'Sale',
    status: prop.status,
    price: prop.price,
    price_per_sqft: prop.pricePerSqFt,
    area: prop.area,
    area_unit: prop.areaUnit,
    city: prop.city,
    location: prop.location,
    address: prop.address,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    parking: prop.parking,
    facing: prop.facing,
    furnishing: prop.furnishing,
    possession: prop.possession,
    featured: prop.featured,
    verified: prop.verified,
    primary_image: prop.primaryImage,
    images: prop.images,
    description: prop.description,
    features: prop.features,
    nearby_facilities: prop.nearbyFacilities,
    rera_id: prop.reraId,
    created_at: prop.createdAt,
    updated_at: prop.updatedAt,
  };
}
