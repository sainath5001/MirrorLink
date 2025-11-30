'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WalletConnectButton from './WalletConnectButton';
import { FEATURE_FLAGS } from '@/lib/constants';
import { FiHome, FiLink, FiFileText, FiSettings } from 'react-icons/fi';

export default function NavBar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: FiHome },
    { href: '/origin', label: 'Origin', icon: FiLink },
    { href: '/destination', label: 'Destination', icon: FiLink },
    { href: '/contracts', label: 'Contracts', icon: FiFileText },
    ...(FEATURE_FLAGS.ENABLE_DEV
      ? [{ href: '/test-trigger', label: 'Test Trigger', icon: FiSettings }]
      : []),
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-600">
                MirrorLink
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = mounted && router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-900 text-primary-200'
                        : 'text-gray-400 hover:text-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}

