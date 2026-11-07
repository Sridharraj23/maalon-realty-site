import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PropertySearchBar from '@/components/home/PropertySearchBar';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import WhatWeDoSection from '@/components/home/WhatWeDoSection';
import HowMaalonWorks from '@/components/home/HowMaalonWorks';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import FinalCtaSection from '@/components/home/FinalCtaSection';
import { getProperties, getTestimonials } from '@/lib/supabase-service';

export default async function HomePage() {
  const properties = await getProperties({ status: 'Available' });
  const testimonials = await getTestimonials(true);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Interactive Property Search */}
      <PropertySearchBar />

      {/* 3. Featured Properties */}
      <FeaturedProperties properties={properties} />

      {/* 4. What We Do */}
      <WhatWeDoSection />

      {/* 5. How Maalon Works (Visual Journeys) */}
      <HowMaalonWorks />

      {/* 6. Customer Testimonials */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* 7. Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}
