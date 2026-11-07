import { Founder, Property, PropertyCategory, SiteSettings, Testimonial } from './types';

export const BRAND = {
  name: 'MAALON REALTY',
  tagline: 'Powering Growth',
  philosophy: 'Every Property Has a Purpose. Every Buyer Has a Place.',
  domain: 'maalonrealty.in',
  url: 'https://maalonrealty.in',
  colors: {
    primary: '#019393',
    primaryDark: '#017A7A',
    primaryLight: '#E6F5F5',
    dark: '#1E1E1E',
    darkSecondary: '#121313',
    gold: '#D4AF37',
  },
  logos: {
    horizontal: '/brand/maalon-logo-horizontal.png',
    vertical: '/brand/maalon-logo-vertical.png',
    emblem: '/brand/maalon-emblem.png',
    wordmark: '/brand/maalon-wordmark.png',
    dark: '/brand/maalon-logo-dark.png',
  },
};

export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  'Apartments',
  'Villas',
  'Independent Houses',
  'Residential Plots',
  'Commercial Properties',
];

export const TAMIL_NADU_LOCATIONS = [
  'Chennai - ECR (East Coast Road)',
  'Chennai - OMR (Old Mahabalipuram Road)',
  'Chennai - Anna Nagar',
  'Chennai - Adyar & Besant Nagar',
  'Chennai - Velachery',
  'Chennai - Porur & Ramapuram',
  'Chennai - GST Road & Tambaram',
  'Chennai - Kilpauk & Chetpet',
  'Chennai - Perungudi & Thoraipakkam',
  'Coimbatore - Race Course',
  'Coimbatore - Saravanampatti',
  'Coimbatore - Avinashi Road',
  'Madurai - K.K. Nagar',
  'Trichy - Thillai Nagar',
  'Hosur - Industrial & Residential Belt',
  'Salem - Fairlands',
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Maalon Realty',
  tagline: 'Every Property Has a Purpose. Every Buyer Has a Place.',
  mission:
    'To connect property sellers with the right buyers and help people find properties where they can build their future.',
  phone: '+91 98400 12345',
  whatsapp: '+91 98400 12345',
  email: 'connect@maalonrealty.in',
  address: 'No. 42, TTK Road, Alwarpet, Chennai, Tamil Nadu 600018',
  workingHours: 'Monday â€“ Saturday: 9:30 AM â€“ 6:30 PM (IST)',
  reraNumber: 'TN/RERA/AGENT/CH/2026/0142 (Applied/Registration in process)',
  socials: {
    instagram: 'https://instagram.com/maalonrealty',
    linkedin: 'https://linkedin.com/company/maalonrealty',
    youtube: 'https://youtube.com/@maalonrealty',
    facebook: 'https://facebook.com/maalonrealty',
  },
  announcement: {
    enabled: true,
    text: 'Exclusive residential & commercial opportunities now open across Chennai & Coimbatore. Schedule your private advisory session today.',
    link: '/properties',
  },
};

export const DEFAULT_FOUNDERS: Founder[] = [
  {
    id: 'f-1',
    name: 'Sridhar M.',
    designation: 'Co-Founder & Managing Partner',
    role: 'Strategic Growth & Developer Partnerships',
    bio: 'Leads strategic partnerships, institutional real estate alliances, and high-value property advisory across Tamil Nadu.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    areasOfResponsibility: [
      'Strategic Growth & Expansion',
      'Developer & Channel Partner Alliances',
      'High-Value Asset Advisory',
      'Brand Governance',
    ],
    email: 'sridhar@maalonrealty.in',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'f-2',
    name: 'Karthik Ramanathan',
    designation: 'Co-Founder & Head of Client Advisory',
    role: 'Buyer Representation & Property Matching',
    bio: 'Dedicated to requirement-driven property discovery, guiding homebuyers and investors through informed, transparent decisions.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    areasOfResponsibility: [
      'Buyer Advisory & Discovery',
      'Requirement-Based Matching',
      'Site Visit Coordination',
      'Customer Experience',
    ],
    email: 'karthik@maalonrealty.in',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'f-3',
    name: 'Arun Balaji',
    designation: 'Co-Founder & Operations Lead',
    role: 'Seller Representation & Transaction Coordination',
    bio: 'Oversees seller property listings, document verification workflows, and legal coordination through qualified legal counsels.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    areasOfResponsibility: [
      'Seller Mandates & Property Onboarding',
      'Information & Documentation Coordination',
      'Valuation & Negotiation Support',
      'Closing Coordination',
    ],
    email: 'arun@maalonrealty.in',
    linkedin: 'https://linkedin.com',
  },
];

export const INITIAL_PROPERTIES: Property[] = [];


export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Vigneshwaran S.',
    transactionType: 'Buyer',
    propertyLocation: 'Akkarai, ECR, Chennai',
    rating: 5,
    content:
      'Finding an authentic sea-side villa with verifiable legal documentation on ECR was daunting until we engaged Maalon Realty. The team understood our privacy requirements, coordinated every survey report, and never rushed our decision. True advisory at its finest.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    approved: true,
    featured: true,
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'test-2',
    name: 'Meenakshi & Sundaram',
    transactionType: 'Seller',
    propertyLocation: 'Anna Nagar West, Chennai',
    rating: 5,
    content:
      'Selling our ancestral home of 35 years was deeply emotional. Maalon Realty represented our property with dignity, screened prospective buyers thoroughly, and closed the sale with a lovely family at our expected valuation. We are forever thankful.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    approved: true,
    featured: true,
    createdAt: '2026-10-24T12:00:00Z',
  },
  {
    id: 'test-3',
    name: 'Rajesh K. Narayanan',
    transactionType: 'Commercial Client',
    propertyLocation: 'Peelamedu, Coimbatore',
    rating: 5,
    content:
      'Maalon Realty identified the ideal commercial floor plate for our regional software center in Coimbatore within two weeks. Their transparency during lease and purchase structure discussions saved us considerable negotiation time.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    approved: true,
    featured: true,
    createdAt: '2026-10-29T15:30:00Z',
  },
];
