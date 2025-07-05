'use client';

import { AuthProvider as AuthProviderInternal } from '@/contexts/AuthContext';

export default function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <AuthProviderInternal>{children}</AuthProviderInternal>;
}