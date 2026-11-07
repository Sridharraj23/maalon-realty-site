# MAALON REALTY – OFFICIAL WEBSITE & ADVISORY PLATFORM

Official Production Domain: [https://maalonrealty.in](https://maalonrealty.in)  
Primary Operating Market: **Tamil Nadu, India** (Chennai, Coimbatore, Madurai, Trichy, Hosur, Salem)  
Brand Philosophy: *"Every Property Has a Purpose. Every Buyer Has a Place."*

---

## 1. BRAND IDENTITY SYSTEM

The entire user experience has been meticulously built around the official **Maalon Realty** logos and brand marks:

- **Primary Brand Teal**: `#019393` (sampled directly from official SVG/PNG marks)
- **Deep Slate / Charcoal Background**: `#1E1E1E` (sampled from official dark lockup)
- **Primary Accent Dark**: `#017A7A` / `#002526`
- **Soft Teal Wash**: `#F0FAF9` / `#E6F5F5`
- **Luxury Gold Accent**: `#D4AF37`
- **Typography Pairing**:
  - Headings: Serif elegance (`Playfair Display`, `Cinzel`)
  - Body & Specs: High-clarity modern sans-serif (`Plus Jakarta Sans`, `Inter`)
- **Official Brand Assets** (stored in `/public/brand/`):
  - `maalon-logo-horizontal.png`: Primary navigation & official header
  - `maalon-logo-vertical.png`: Stacked mark for hero and banners
  - `maalon-emblem.png`: Geometric 'M' with stylized sprout/peacock crown
  - `maalon-wordmark.png`: "MAALON" with "POWERING GROWTH"
  - `maalon-logo-dark.png`: High-contrast dark slate lockup
  - `favicon.png` & `apple-touch-icon.png`: Official emblem browser icons

---

## 2. SYSTEM ARCHITECTURE & TECH STACK

- **Frontend & Full-Stack Engine**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom Maalon theme extensions
- **Icons & UI Components**: Lucide-React
- **Database & Backend**: PostgreSQL via **Supabase** with Row Level Security (RLS) policies
- **Dual-Mode Data Layer**: Built-in resilient local persistent JSON store (`data/store.json`) with zero-config immediate operation, transitioning seamlessly to Supabase PostgreSQL when credentials are provided in `.env.local`.
- **SEO & Performance**: Dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, structured JSON-LD schemas, and Indian currency/area notation helpers.

---

## 3. HOW THE 3 FOUNDING PARTNERS OPERATE THE WEBSITE

The website is engineered so that the three founding members can manage and update the entire platform without touching a single line of code.

### Admin Access
- **URL**: `http://localhost:3000/admin/login` (or `https://maalonrealty.in/admin/login`)
- **Default Login**:
  - **Email**: `admin@maalonrealty.in` (also supports `sridhar@maalonrealty.in`, `karthik@maalonrealty.in`, `arun@maalonrealty.in`)
  - **Password**: `Maalon@2026`
  *(Change anytime via environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`)*

### Operational Modules

#### Module 1: Property Management (`/admin/properties`)
- **Add New Property** (`/admin/properties/new`): Title, category (Villas, Apartments, Plots, Independent Houses, Commercial, Agricultural Land), asking price with auto Indian currency preview (`₹1.50 Cr`), area & unit (`sq.ft`, `grounds`, `acres`, `cents`), location, specifications (beds, baths, facing, furnishing, parking), multiple photo URLs, and amenities tags.
- **Auto-Generated Property IDs**: Automatically assigns IDs like `MAG-101`, `MAG-102`.
- **Live Instant Publishing**: Changes appear immediately on the public website.
- **Status Lifecycle**: Toggle listings between `Available`, `Under Negotiation`, `Sold`, and `Unavailable`.

#### Module 2: Buyer Enquiries CRM (`/admin/buyers`)
- View incoming buyer requests submitted via `/find-property` or individual property detail pages.
- **Pipeline Statuses**: `New`, `Contacted`, `Qualified`, `Property Matched`, `Site Visit Scheduled`, `Negotiation`, `Converted`, `Lost`.
- **Assign Partner**: Route leads directly to Sridhar M., Karthik Ramanathan, or Arun Balaji.
- **Internal Notes Log**: Add date-stamped notes on buyer requirements, budget discussions, or site visit feedback.
- **Automated Inventory Matcher**: One-click matching button filters available inventory fitting the buyer's budget and category parameters.

#### Module 3: Seller Submissions & Mandates (`/admin/sellers`)
- Review property owner submissions submitted via `/sell-property`.
- Inspect ownership titles, revenue documents checklist (Patta, Parent Deed, CMDA/DTCP approval), and pricing expectations.
- **One-Click Convert to Listing**: Convert verified seller submissions into official public property listings with pre-populated details in a single click.

#### Module 4: Testimonial Moderation (`/admin/testimonials`)
- Review submitted client reviews from the "Share Your Experience" modal.
- Approve, edit, feature, or reject testimonials before they appear publicly.
- Add verified direct written or video reviews.

#### Module 5: Central Website Settings & Founders (`/admin/settings`)
- Update Central Phone Number and Business WhatsApp Number.
- Update Office Address, Operating Hours, and RERA Registration Number.
- Update Social Media Links (Instagram, LinkedIn, YouTube, Facebook).
- Edit Founder Profiles (names, designations, roles, bios, images, areas of responsibility).
- Toggle and edit the top announcement banner.

#### Module 6: Executive Analytics Dashboard (`/admin/dashboard`)
- Real-time KPIs: Active listings, total inventory valuation, buyer leads, pending seller mandates, scheduled site visits, and sold portfolio counts.

---

## 4. PUBLIC WEBSITE PAGES & ROUTES

1. **Homepage** (`/`):
   - Hero section with official headline: *"Every Property Has a Purpose. Every Buyer Has a Place."*
   - Interactive search bar (Location, Category, Budget range, Buy/Rent toggle).
   - Featured properties grid with verified badges and Indian pricing.
   - "What We Do": 3 service cards (Sell With Us, Buy With Us, Strategic Advisory).
   - "How Maalon Works": Interactive dual-timeline (Seller 5-step vs Buyer 5-step).
   - "Why Maalon Realty": 6 value pillars.
   - Testimonial carousel with "Share Your Experience" modal.
   - Final CTA & comprehensive footer with RERA disclosure.
2. **Properties Catalog** (`/properties`):
   - Dynamic search, multi-category filters, budget sliders, area range, bedrooms, and status filters.
   - Sort by Recently Added, Price (Low to High), Price (High to Low), Area (Largest First).
3. **Property Detail Page** (`/properties/[slug]`):
   - SEO-friendly URL, high-resolution photo gallery with thumbnail switcher.
   - Overview specs, description, amenities chips, nearby landmark distances, and advisory disclaimer.
   - Contextual CTA buttons: "Enquire About This Property" (captures Property ID & Title), "Schedule a Site Visit" modal, and pre-filled WhatsApp button.
4. **Sell Your Property** (`/sell-property`):
   - Comprehensive property owner submission form capturing title details, document availability, and owner authorization. Generates unique submission ID (e.g. `SEL-201`).
5. **Find Your Property** (`/find-property`):
   - Dedicated buyer requirement portal with budget, purpose, timeline, and preference capture. Generates Lead ID (e.g. `BUY-101`).
6. **About Us** (`/about`):
   - Our story, mission, vision, core values, and profiles for the 3 founding partners.
7. **Our Process** (`/process`):
   - Detailed visual breakdown of the 8-Stage Seller Journey and 8-Stage Buyer Journey.
8. **Testimonials** (`/testimonials`):
   - Written and video testimonials with filter by transaction type.
9. **Contact Us** (`/contact`):
   - Direct call, WhatsApp, email, office address, map embed, and category-based contact form.
10. **Legal & Compliance** (`/privacy`, `/terms`):
    - Indian DPDP compliance, zero-telemarketing pledge, and RERA disclosures.
11. **SEO Endpoints**:
    - `/sitemap.xml`: Auto-generated dynamic XML sitemap with all active property URLs.
    - `/robots.txt`: Search crawler directives protecting `/admin/` and `/api/`.

---

## 5. LOCAL RUN INSTRUCTIONS

To launch the website on your local machine:
1. Double click `START_WEBSITE.bat` or run:
   ```powershell
   npm start
   ```
2. Open your browser at:
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 6. SUPABASE SETUP GUIDE (POSTGRESQL & STORAGE)

When you are ready to connect a live cloud Supabase database:
1. Log in to [https://supabase.com](https://supabase.com) and create a new project (e.g., `maalon-realty-prod`).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Open `supabase_schema.sql` from this repository, paste the entire contents into the SQL Editor, and click **Run**.
   - This creates all 10 tables (`properties`, `buyers`, `sellers`, `testimonials`, `contact_submissions`, `site_visits`, `site_settings`, etc.).
   - It enables Row Level Security (RLS) to ensure buyer and seller confidential contact details are never exposed to the public.
4. Go to **Project Settings -> API** in Supabase and copy:
   - `Project URL`
   - `anon public` key
5. Add them to your `.env.local` or hosting provider environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 7. DEPLOYMENT TO VERCEL & OFFICIAL DOMAIN (maalonrealty.in)

1. Push this repository to GitHub or GitLab.
2. Go to [https://vercel.com](https://vercel.com) and click **"Add New Project" -> Import Repository**.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://maalonrealty.in`
   - `ADMIN_EMAIL`: `admin@maalonrealty.in`
   - `ADMIN_PASSWORD`: `<your-secure-password>`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: `+919840012345`
   - (Optional) `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.
5. Go to **Project Settings -> Domains** in Vercel:
   - Add `maalonrealty.in` and `www.maalonrealty.in`.
   - Update your DNS records at your domain registrar (A record pointing to `76.76.21.21` and CNAME `cname.vercel-dns.com`).
6. SSL is automatically provisioned and the site is live at `https://maalonrealty.in`!
