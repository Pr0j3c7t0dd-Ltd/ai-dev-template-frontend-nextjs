'use client';

import { useEffect } from 'react';
import { handleInitialScroll } from '@/lib/scroll-utils';

export function HomeScrollHandler() {
  useEffect(() => {
    // Handle hash navigation after page load
    handleInitialScroll();
  }, []);

  // This component doesn't render anything
  return null;
}
