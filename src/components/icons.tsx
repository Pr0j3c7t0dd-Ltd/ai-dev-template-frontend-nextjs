'use client';

import { Terminal, Sun, Moon, Laptop, type LucideIcon, type LucideProps } from 'lucide-react';

// Type for icons
export type Icon = LucideIcon;

// Object containing all our icons for easy access
export const Icons = {
  Logo: Terminal,
  Sun: Sun,
  Moon: Moon,
  Laptop: Laptop,
};

// Helper component for consistent icon styling
export const IconWrapper = ({
  icon: Icon,
  className,
  ...props
}: {
  icon: Icon;
  className?: string;
} & LucideProps) => {
  return <Icon className={className} {...props} />;
};
