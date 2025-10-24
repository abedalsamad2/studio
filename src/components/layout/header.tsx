'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Copyright,
  DollarSign,
  Globe,
  Key,
  Link2,
  Menu,
  Sparkles,
  Home
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/availability', label: 'Availability', icon: Globe },
  { href: '/keywords', label: 'Keywords', icon: Key },
  { href: '/backlinks', label: 'Backlinks', icon: Link2 },
  { href: '/valuation', label: 'Valuation', icon: DollarSign },
  { href: '/generator', label: 'Generator', icon: Sparkles },
  { href: '/trademarks', label: 'Trademarks', icon: Copyright },
];

export default function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BarChart className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Domain Insights
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
              <BarChart className="mr-2 h-6 w-6 text-primary" />
              <span className="font-bold">Domain Insights</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      'transition-colors hover:text-primary',
                      pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center space-x-2 md:hidden">
          <BarChart className="h-6 w-6 text-primary" />
          <span className="font-bold">Domain Insights</span>
        </Link>
      </div>
    </header>
  );
}
