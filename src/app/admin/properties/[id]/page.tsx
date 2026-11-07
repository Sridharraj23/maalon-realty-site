import React from 'react';
import { INITIAL_PROPERTIES } from '@/lib/constants';
import EditPropertyClient from './EditPropertyClient';

export function generateStaticParams() {
  return INITIAL_PROPERTIES.map((p) => ({
    id: p.id,
  }));
}

export default function EditPropertyPage() {
  return <EditPropertyClient />;
}
