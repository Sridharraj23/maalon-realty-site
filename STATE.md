# MAALON REALTY – SYSTEM STATE & DEPLOYMENT LOG

**Last Updated:** 2026-11-07  
**Official Domain:** [https://maalonrealty.in](https://maalonrealty.in)  
**Apex URL:** [http://maalonrealty.in](http://maalonrealty.in) | **WWW URL:** [http://www.maalonrealty.in](http://www.maalonrealty.in) (301 redirects to apex)  
**GitHub Repository:** [https://github.com/Sridharraj23/maalon-realty-site](https://github.com/Sridharraj23/maalon-realty-site) (Branch: `main`)  
**Deployment Pipeline:** GitHub Actions (`.github/workflows/deploy.yml`) -> GitHub Pages Edge CDN  
**Backend:** Supabase PostgreSQL (`https://qrcymgulzrgrozhrjajn.supabase.co`)  

---

## 1. Architectural Evolution Today

Today the application was migrated from a hybrid Node.js server with local JSON storage to a **pure decoupled static-first architecture** with cloud persistence:

```
[ Visitor / Client Browser ]
             │
             ├──► Static Assets & SSG Pages  ────► GitHub Pages Edge CDN (Chennai)
             │
             └──► Direct REST API / Queries  ────► Supabase Cloud PostgreSQL
```

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS + Lucide Icons. Configured with `output: 'export'` and `trailingSlash: true`.
- **Backend:** Supabase REST service layer (`@supabase/supabase-js`) with client-side fail-safe fallbacks.
- **Security:** PostgreSQL Row Level Security (RLS) is enabled on all tables. Anonymous visitors can submit leads, but cannot query or view other users' submissions.
- **Serverless/Zero-Server:** No Node server or VPS maintenance required. Free hosting on GitHub Pages and Supabase.

---

## 2. Infrastructure & Live Configuration

### A. GoDaddy DNS Settings (Configured & Verified)
| Type | Name | Data / Target | Status |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | Active & Verified |
| **A** | `@` | `185.199.109.153` | Active & Verified |
| **A** | `@` | `185.199.110.153` | Active & Verified |
| **A** | `@` | `185.199.111.153` | Active & Verified |
| **CNAME** | `www` | `maalonrealty.in` | Active (301 redirects to apex) |

### B. GitHub Repository & Pages Setup
- **Pages Mode:** Switched from legacy Jekyll source to `build_type: workflow`.
- **Workflow File:** `.github/workflows/deploy.yml` triggers on every push to `main` or manually via `workflow_dispatch`.
- **Secrets Configured on Repo:**
  - `NEXT_PUBLIC_SITE_URL`: `https://maalonrealty.in`
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://qrcymgulzrgrozhrjajn.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_G3HCcfu8mERdjh5I4eJEfQ_1aw7qFxe`
- **SSL / HTTPS Status:** DNS is verified by GitHub. GitHub's Let's Encrypt automated challenge is processing. Once issued, HTTPS will enforce automatically or can be toggled under [GitHub Pages Settings](https://github.com/Sridharraj23/maalon-realty-site/settings/pages).

---

## 3. Database & Supabase State

### Supabase Connection
- **Project URL:** `https://qrcymgulzrgrozhrjajn.supabase.co`
- **Key Type:** Modern Supabase Publishable Key (`sb_publishable_...`)
- **Schema File:** `supabase_schema.sql` (executed in Supabase SQL Editor)

### Tables & RLS Policies Summary
| Table | Description | Public Access (RLS) | Status |
| :--- | :--- | :--- | :--- |
| `properties` | Real estate inventory & listings | `SELECT` enabled (read-only for public) | Active (empty, ready for real listings) |
| `buyers` | Buyer leads & property requests | `INSERT` enabled (write-only) | Active & Verified |
| `sellers` | Seller mandates & property valuations | `INSERT` enabled (write-only) | Active & Verified |
| `contact_submissions`| General inquiries from `/contact/` | `INSERT` enabled (write-only) | Active & Verified (Test record `TEST-VERIFY-002` verified) |
| `site_visits` | In-person property tour schedules | `INSERT` enabled (write-only) | Active & Verified |
| `testimonials` | Customer reviews & ratings | `SELECT` (approved=true), `INSERT` (approved=false) | Active |
| `site_settings` | Company details, phone, address | `SELECT` enabled | Active |

---

## 4. Current Listing State (Sample Data Dropped)

- **Sample Properties Removed:** `INITIAL_PROPERTIES` in `src/lib/constants.ts` is now `[]`.
- **Archived Reference:** The original 10 sample property definitions have been preserved in `_server_api_archive/sample-properties-reference.ts` so all property formats, fields, and structures remain available for reference.
- **Empty State UX:**
  - `/properties/` displays a clean empty state inviting visitors to submit requirements (`/find-property/`).
  - Home page (`/`) displays an onboarding message directing users to tell their property preferences.

---

## 5. How to Add Real Properties (Quick Reference)

### Option 1: Via Supabase Table Editor (Easiest)
1. Open your [Supabase Table Editor](https://supabase.com/dashboard/project/qrcymgulzrgrozhrjajn/editor).
2. Click on the `properties` table.
3. Click **Insert row** and fill in the fields:
   - `id`: Unique identifier (e.g., `MLN-101`, `ECR-VILLA-01`)
   - `title`: Display title (e.g. `Luxury 4 BHK Sea View Villa, ECR`)
   - `slug`: URL-friendly slug (e.g. `luxury-4-bhk-sea-view-villa-ecr-chennai`)
   - `category`: `Apartments`, `Villas`, `Independent Houses`, `Residential Plots`, `Commercial Properties`, or `Agricultural Land`
   - `status`: `Available`, `Under Negotiation`, or `Sold`
   - `price`: Numerical price in INR (e.g. `38500000` for ₹3.85 Cr)
   - `price_per_sqft`: Numerical price per sq.ft (e.g. `11000`)
   - `area`: Area in units (e.g. `3500`)
   - `area_unit`: `sq.ft`, `acres`, `cents`, or `grounds`
   - `city`: e.g. `Chennai` or `Coimbatore`
   - `location`: e.g. `ECR, Akkarai, Chennai`
   - `address`: Detailed street address
   - `bedrooms` / `bathrooms`: Integer counts
   - `parking`: Description (e.g. `2 Covered Slots`)
   - `facing`: e.g. `East Facing`
   - `furnishing`: `Unfurnished`, `Semi-Furnished`, or `Fully Furnished`
   - `possession`: e.g. `Ready to Move`
   - `featured`: `true` or `false`
   - `verified`: `true`
   - `primary_image`: Image URL (from Unsplash, Cloudinary, or Supabase Storage)
   - `images`: Array of image URLs (e.g. `{"https://...","https://..."}`)
   - `description`: Detailed markdown or text description
   - `features`: Array of string highlights (e.g. `{"Private Pool","Power Backup"}`)
   - `nearby_facilities`: JSON array (e.g. `[{"name":"Beach","distance":"400m"}]`)
   - `rera_id`: RERA registration number or `Exempt`

### Option 2: Via SQL Insert (Bulk)
Run SQL in the [Supabase SQL Editor](https://supabase.com/dashboard/project/qrcymgulzrgrozhrjajn/sql):
```sql
INSERT INTO public.properties (
    id, title, slug, category, status, price, price_per_sqft, area, area_unit,
    city, location, address, bedrooms, bathrooms, parking, facing, furnishing,
    possession, featured, verified, primary_image, images, description, features
) VALUES (
    'MLN-001',
    'Sea Breeze 4 BHK Villa',
    'sea-breeze-4-bhk-villa-akkarai-ecr',
    'Villas',
    'Available',
    42000000,
    12000,
    3500,
    'sq.ft',
    'Chennai',
    'ECR, Akkarai',
    'East Coast Road, Akkarai, Chennai - 600119',
    4,
    4,
    '2 Covered Cars',
    'East Facing',
    'Semi-Furnished',
    'Ready to Move',
    true,
    true,
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
    ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80'],
    'Exceptional coastal villa walking distance to the beach with private lawn and modular fittings.',
    ARRAY['Private Garden', '24x7 Security', '100% Power Backup']
);
```

---

## 6. Archive & Rollback Resources

- **Full-Server Rollback Tag:** Git tag `v1.0-full-server` contains the complete prior state with local Node.js API routes and file system JSON stores.
- **API Archive Directory:** `_server_api_archive/` contains the legacy API route controllers.
- **Sample Properties Reference:** `_server_api_archive/sample-properties-reference.ts` contains the exact 10 sample property definitions for structural reference.

---

## 7. Next Steps Checklist When Resuming

1. **Check HTTPS Status:**
   Visit [GitHub Pages Settings](https://github.com/Sridharraj23/maalon-realty-site/settings/pages) and confirm "Enforce HTTPS" is checked once Let's Encrypt finishes provisioning.
2. **Add First Real Property:**
   Insert your first real property in the Supabase Table Editor. It will instantly show on `/properties/` and the home page upon live query or rebuild.
3. **Review Lead Submissions:**
   Check Supabase `buyers`, `sellers`, and `contact_submissions` periodically to see incoming customer leads.
