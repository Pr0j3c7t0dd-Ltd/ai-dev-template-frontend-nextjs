'use client';

import NextLink from 'next/link';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  className?: string;
  underline?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, underline = false, ...props }, ref) => {
    return (
      <NextLink
        className={cn(
          'text-primary hover:underline transition-colors',
          underline && 'underline',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = 'Link';

export { Link };
