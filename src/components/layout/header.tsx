'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Menu, X } from 'lucide-react';
import { NavAuth } from '@/components/auth/nav-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { scrollToSection, setupSectionObservers } from '@/lib/scroll-utils';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/', sectionId: 'hero' },
  { label: 'Features', href: '/#features', sectionId: 'features' },
  { label: 'Pricing', href: '/#pricing', sectionId: 'pricing' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Only set up observers when on the home page
    if (isHomePage) {
      const cleanup = setupSectionObservers(sectionId => {
        setActiveSection(sectionId);
      });

      // Clean up observers on unmount
      return cleanup;
    }
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (href: string) => {
    // Only use smooth scrolling when already on the home page
    if (isHomePage && (href.startsWith('/#') || href === '/')) {
      // Prevent default link behavior for hash links and home
      scrollToSection(href);
      setIsMenuOpen(false);
      return false;
    }
    // Allow normal navigation otherwise
    setIsMenuOpen(false);
    return true;
  };

  const isActive = (sectionId: string) => {
    return isHomePage && activeSection === sectionId;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <span className="font-bold inline-block">AI Dev Template</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(item.sectionId) && 'text-primary font-semibold'
              )}
              onClick={e => {
                if (!handleNavClick(item.href)) {
                  e.preventDefault();
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <NavAuth />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 top-16 z-50 bg-background md:hidden',
          isMenuOpen ? 'flex flex-col' : 'hidden'
        )}
      >
        <nav className="flex flex-col items-center justify-center space-y-6 p-8">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-lg font-medium transition-colors hover:text-primary',
                isActive(item.sectionId) && 'text-primary font-semibold'
              )}
              onClick={e => {
                if (!handleNavClick(item.href)) {
                  e.preventDefault();
                }
                setIsMenuOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6">
            <NavAuth />
          </div>
        </nav>
      </div>
    </header>
  );
}
