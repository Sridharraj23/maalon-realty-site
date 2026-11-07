import React from 'react';
import { INITIAL_PROPERTIES } from '@/lib/constants';
import PropertyDetailClient from './PropertyDetailClient';

export function generateStaticParams() {
  if (INITIAL_PROPERTIES.length === 0) {
    return [{ slug: 'preview' }];
  }
  return INITIAL_PROPERTIES.map((p) => ({
    slug: p.slug,
  }));
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
