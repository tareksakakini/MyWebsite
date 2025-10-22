'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Research', href: '/research' },
    { name: 'Teaching', href: '/teaching' },
    { name: 'Apps', href: '/apps' },
  ];

  const baseLinkClasses =
    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors';

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-baseline text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              <img 
                src="/personal_logo.png" 
                alt="Tarek Sakakini Logo" 
                className="w-7 h-7 object-contain mr-0.01 self-center -mt-1 ml-4"
              />
              <span className="font-serif">arek Sakakini</span>
            </Link>
          </div>
          {/* Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
              const activeClasses = isActive
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${baseLinkClasses} ${activeClasses}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
