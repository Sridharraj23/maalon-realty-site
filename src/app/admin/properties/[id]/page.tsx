import React from 'react';
import { INITIAL_PROPERTIES } from '@/lib/constants';
import EditPropertyClient from './EditPropertyClient';

export function generateStaticParams() {
  if (INITIAL_PROPERTIES.length === 0) {
    return [{ id: 'new-draft' }];
  }
  return INITIAL_PROPERTIES.map((p) => ({
    id: p.id,
  }));
}

export default function EditPropertyPage() {
  return <EditPropertyClient />;
}
