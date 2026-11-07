import React from 'react';
import { INITIAL_PROPERTIES } from '@/lib/constants';
import PropertyDetailClient from './PropertyDetailClient';

export function generateStaticParams() {
  return INITIAL_PROPERTIES.map((p) => ({
    slug: p.slug,
  }));
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
