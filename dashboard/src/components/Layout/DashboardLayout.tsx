'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { admin, logout, isSuperAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

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
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
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
  }, [isDropdownOpen]);

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

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Activities',
      href: '/dashboard/events',
      icon: Calendar,
    },
    {
      name: 'Inscriptions',
      href: '/dashboard/inscriptions',
      icon: FileText,
    },
    {
      name: 'Participants',
      href: '/dashboard/participants',
      icon: Users,
    },
    {
      name: 'All Users',
      href: '/dashboard/users',
      icon: UserCheck,
    },
    {
      name: 'Leaderboard',
      href: '/dashboard/leaderboard',
      icon: Trophy,
    },
    {
      name: 'Chats',
      href: '/dashboard/chats',
      icon: MessageSquare,
    },
    {
      name: 'Livestreams',
      href: '/dashboard/livestreams',
      icon: Video,
    },
    {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: DollarSign,
    },
    {
      name: 'Settings',
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
                    isActive
                      ? 'bg-indigo-100 text-indigo-900 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  />
                  {item.name}
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
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-[9999] border-b border-gray-200">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h2>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                      {admin?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {nom} {prenom && prenom}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {isSuperAdmin ? 'Super Admin' : 'Admin'}
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
                  className="fixed w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[9999]" 
                  style={{ 
                    top: `${dropdownPosition.top}px`,
                    right: `${dropdownPosition.right}px`,
                    isolation: 'isolate',
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    pointerEvents: 'auto'
                  }}
                >
                  {/* Profile Header */}
                  <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
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
                            {isSuperAdmin ? 'Super Admin' : 'Admin'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Profil
                    </button>
                    <button
                      onClick={handleUsersClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Users className="mr-3 h-4 w-4 text-gray-500" />
                      Users
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-700" />
                      Déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
