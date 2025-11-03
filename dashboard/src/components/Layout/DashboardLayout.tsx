'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Trophy,
  MessageSquare,
  Video,
  FileText,
  LogOut,
  DollarSign,
  User,
  ChevronDown,
  UserPlus,
  Settings,
  Globe,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { admin, logout, isSuperAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number | string; left: number | string }>({ top: 0, right: 0, left: 'auto' });

  // Extract nom and prenom from name (if space-separated)
  const getNameParts = () => {
    if (!admin?.name) return { nom: '', prenom: '' };
    const parts = admin.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return { nom: parts[0], prenom: parts.slice(1).join(' ') };
    }
    return { nom: admin.name, prenom: '' };
  };

  const { nom, prenom } = getNameParts();

  // Calculate dropdown position and handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (buttonRef.current && isDropdownOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        const isRTL = language === 'ar';
        const dropdownWidth = 288; // w-72 = 18rem = 288px
        
        if (isRTL) {
          // In RTL, align dropdown to left edge of button (button is on left side in RTL)
          // Ensure dropdown doesn't go off the left edge of screen
          const leftPosition = Math.max(8, rect.left);
          setDropdownPosition({
            top: rect.bottom + 8,
            left: leftPosition,
            right: 'auto',
          });
        } else {
          // In LTR, align dropdown to right edge of button (button is on right side in LTR)
          // Calculate right position and ensure dropdown doesn't go off the right edge
          const rightPosition = Math.max(8, window.innerWidth - rect.right);
          setDropdownPosition({
            top: rect.bottom + 8,
            right: rightPosition,
            left: 'auto',
          });
        }
      }
    };

    if (isDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', updateDropdownPosition, true);
    }

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isDropdownOpen, language]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/dashboard/profile');
  };

  const handleUsersClick = () => {
    setIsDropdownOpen(false);
    router.push('/dashboard/users');
  };

  const handleLanguageChange = async (newLanguage: 'fr' | 'ar' | 'en') => {
    await setLanguage(newLanguage);
  };

  const languages = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'ar' as const, label: 'العربية', flag: '🇩🇿' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const navigation = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('nav.activities'),
      href: '/dashboard/events',
      icon: Calendar,
    },
    {
      name: t('nav.inscriptions'),
      href: '/dashboard/inscriptions',
      icon: FileText,
    },
    {
      name: t('nav.participants'),
      href: '/dashboard/participants',
      icon: Users,
    },
    {
      name: t('nav.allUsers'),
      href: '/dashboard/users',
      icon: UserCheck,
    },
    {
      name: t('nav.leaderboard'),
      href: '/dashboard/leaderboard',
      icon: Trophy,
    },
    {
      name: t('nav.chats'),
      href: '/dashboard/chats',
      icon: MessageSquare,
    },
    {
      name: t('nav.livestreams'),
      href: '/dashboard/livestreams',
      icon: Video,
    },
    {
      name: t('nav.payments'),
      href: '/dashboard/payments',
      icon: DollarSign,
    },
    {
      name: t('nav.settings'),
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-22 px-4">
            <img
              src="/logo.png"
              alt="Algeria Youth Network Logo"
              className="h-10 w-10 mr-3 object-contain"
            />
            <h1 className="text-xl font-bold text-indigo-600">Algeria Youth Network</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto bg-white">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    language === 'ar' ? 'flex-row-reverse' : ''
                  } ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-900 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      language === 'ar' ? 'ml-3' : 'mr-3'
                    } ${
                      isActive ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm hover:shadow"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className={`text-2xl font-semibold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
              {navigation.find((item) => item.href === pathname)?.name || t('nav.dashboard')}
            </h2>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  language === 'ar' ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'
                }`}
              >
                <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                      {admin?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  </div>
                  <div className={`flex-1 min-w-0 hidden md:block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className={`text-sm font-medium text-gray-900 truncate ${language === 'ar' ? 'text-right' : ''}`}>
                      {nom} {prenom && prenom}
                    </p>
                    <p className={`text-xs text-gray-500 truncate ${language === 'ar' ? 'text-right' : ''}`}>
                      {isSuperAdmin ? t('events.superAdmin') : t('events.admin')}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className={`fixed w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 ${
                    language === 'ar' ? 'text-right' : ''
                  }`}
                  style={{ 
                    top: `${dropdownPosition.top}px`,
                    right: typeof dropdownPosition.right === 'number' ? `${dropdownPosition.right}px` : dropdownPosition.right,
                    left: typeof dropdownPosition.left === 'number' ? `${dropdownPosition.left}px` : dropdownPosition.left,
                    isolation: 'isolate',
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    pointerEvents: 'auto'
                  }}
                >
                  {/* Profile Header */}
                  <div className={`px-4 py-4 bg-gray-50 border-b border-gray-200 ${language === 'ar' ? 'pr-4 pl-4' : ''}`}>
                    <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-3 flex-row-reverse' : 'space-x-3'}`}>
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                          {admin?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {nom} {prenom && prenom}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
                        <p className="text-xs mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              isSuperAdmin
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isSuperAdmin ? t('events.superAdmin') : t('events.admin')}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className={`w-full flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                        language === 'ar' ? 'flex-row-reverse pl-4 pr-4' : 'px-4'
                      }`}
                    >
                      <User className={`h-4 w-4 text-gray-500 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                      <span className="flex-1">{t('nav.profile')}</span>
                    </button>
                    <button
                      onClick={handleUsersClick}
                      className={`w-full flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                        language === 'ar' ? 'flex-row-reverse pl-4 pr-4' : 'px-4'
                      }`}
                    >
                      <Users className={`h-4 w-4 text-gray-500 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                      <span className="flex-1">{t('nav.users')}</span>
                    </button>
                    
                    {/* Language Selector */}
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className={`py-2 ${language === 'ar' ? 'pl-4 pr-4' : 'px-4'}`}>
                      <div className={`flex items-center mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Globe className={`h-4 w-4 text-gray-500 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                        <span className="text-xs font-medium text-gray-500 uppercase">{t('nav.language')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex flex-col items-center justify-center px-2 py-2 rounded-md text-xs transition-colors ${
                              language === lang.code
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <span className="text-base mb-1">{lang.flag}</span>
                            <span className="text-[10px] font-medium">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center py-2 text-sm text-red-700 hover:bg-red-50 transition-colors ${
                        language === 'ar' ? 'flex-row-reverse pl-4 pr-4' : 'px-4'
                      }`}
                    >
                      <LogOut className={`h-4 w-4 text-red-700 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                      <span className="flex-1">{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`p-8 bg-gray-50 ${language === 'ar' ? 'text-right' : ''}`}>{children}</main>
      </div>
    </div>
  );
}
