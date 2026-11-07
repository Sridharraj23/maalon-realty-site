-- ================================================================
-- MAALON REALTY – OFFICIAL SUPABASE DATABASE SCHEMA
-- Official Domain: https://maalonrealty.in
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'MAG-101'
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Apartments', 'Villas', 'Independent Houses', 'Residential Plots', 'Commercial Properties', 'Agricultural Land'
    status VARCHAR(50) NOT NULL DEFAULT 'Available', -- 'Available', 'Under Negotiation', 'Sold', 'Unavailable'
    price NUMERIC(15, 2) NOT NULL,
    price_per_sqft NUMERIC(12, 2),
    area NUMERIC(12, 2) NOT NULL,
    area_unit VARCHAR(20) NOT NULL DEFAULT 'sq.ft', -- 'sq.ft', 'grounds', 'acres', 'cents'
    city VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    parking VARCHAR(100),
    facing VARCHAR(100),
    furnishing VARCHAR(50), -- 'Unfurnished', 'Semi-Furnished', 'Fully Furnished'
    possession VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    primary_image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    nearby_facilities JSONB DEFAULT '[]'::jsonb,
    rera_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BUYER ENQUIRIES TABLE (PRIVATE LEADS)
CREATE TABLE IF NOT EXISTS public.buyers (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'BUY-101'
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    preferred_location VARCHAR(255) NOT NULL,
    alternative_locations VARCHAR(255),
    min_budget NUMERIC(15, 2) NOT NULL,
    max_budget NUMERIC(15, 2) NOT NULL,
    required_area VARCHAR(100),
    bedrooms VARCHAR(50),
    bathrooms VARCHAR(50),
    purpose VARCHAR(50) DEFAULT 'Self-use', -- 'Self-use', 'Investment', 'Business'
    timeline VARCHAR(100),
    funding_preference VARCHAR(100),
    preferences TEXT,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Contacted', 'Qualified', 'Property Matched', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost'
    assigned_to VARCHAR(100),
    property_id VARCHAR(50) REFERENCES public.properties(id) ON DELETE SET NULL,
    property_name VARCHAR(255),
    internal_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SELLER ENQUIRIES TABLE (PRIVATE MANDATES)
CREATE TABLE IF NOT EXISTS public.sellers (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'SEL-201'
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    preferred_contact VARCHAR(50) DEFAULT 'Phone Call',
    property_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    full_address TEXT NOT NULL,
    area NUMERIC(12, 2) NOT NULL,
    area_unit VARCHAR(20) DEFAULT 'sq.ft',
    expected_price NUMERIC(15, 2) NOT NULL,
    bedrooms INTEGER,
    description TEXT NOT NULL,
    ownership_status VARCHAR(100),
    document_availability TEXT[] DEFAULT '{}',
    is_listed_elsewhere VARCHAR(20) DEFAULT 'No',
    timeline VARCHAR(100),
    remarks TEXT,
    images TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Reviewed', 'Owner Contacted', 'Verification In-Progress', 'Approved', 'Rejected'
    converted_to_property_id VARCHAR(50),
    assigned_to VARCHAR(100),
    internal_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    transaction_type VARCHAR(100) NOT NULL, -- 'Buyer', 'Seller', 'Investor', 'Commercial Client'
    property_location VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    photo_url TEXT,
    video_url TEXT,
    approved BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'CNT-301'
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Replied', 'Resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SITE VISITS TABLE
CREATE TABLE IF NOT EXISTS public.site_visits (
    id VARCHAR(50) PRIMARY KEY,
    property_id VARCHAR(50) REFERENCES public.properties(id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled',
    assigned_to VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255) DEFAULT 'Maalon Realty',
    tagline TEXT,
    mission TEXT,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    working_hours VARCHAR(255),
    rera_number VARCHAR(255),
    socials JSONB DEFAULT '{}'::jsonb,
    announcement JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Properties: Public can view active listings
CREATE POLICY "Public can view properties" ON public.properties
    FOR SELECT USING (true);

-- Testimonials: Public can only view approved testimonials
CREATE POLICY "Public can view approved testimonials" ON public.testimonials
    FOR SELECT USING (approved = true);

-- Testimonials: Public can insert pending testimonials
CREATE POLICY "Public can submit testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (approved = false);

-- Buyers: Public can submit inquiries (insert only, cannot read other buyer leads)
CREATE POLICY "Public can submit buyer enquiry" ON public.buyers
    FOR INSERT WITH CHECK (true);

-- Sellers: Public can submit property seller details (insert only)
CREATE POLICY "Public can submit seller enquiry" ON public.sellers
    FOR INSERT WITH CHECK (true);

-- Contact submissions: Public can submit contact messages
CREATE POLICY "Public can submit contact form" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- Site visits: Public can schedule visits
CREATE POLICY "Public can request site visit" ON public.site_visits
    FOR INSERT WITH CHECK (true);

-- Site settings: Public can read settings
CREATE POLICY "Public can read site settings" ON public.site_settings
    FOR SELECT USING (true);

-- ================================================================
-- PERFORMANCE INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured);
CREATE INDEX IF NOT EXISTS idx_buyers_status ON public.buyers(status);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON public.sellers(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON public.testimonials(approved);
