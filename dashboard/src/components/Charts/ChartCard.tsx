'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, icon: Icon, children, className = '' }: ChartCardProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className={`p-6 border-b border-gray-200 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
              <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{title}</h3>
            </div>
            {subtitle && (
              <p className={`text-sm text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`}>{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

