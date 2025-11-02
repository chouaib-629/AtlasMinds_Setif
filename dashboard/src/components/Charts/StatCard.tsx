'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
  };
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-600',
  trend,
  children,
}: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : null;

  const getGradientClass = (color: string) => {
    if (color.includes('indigo')) return 'from-indigo-50 to-indigo-100';
    if (color.includes('green')) return 'from-green-50 to-green-100';
    if (color.includes('blue')) return 'from-blue-50 to-blue-100';
    if (color.includes('purple')) return 'from-purple-50 to-purple-100';
    if (color.includes('cyan')) return 'from-cyan-50 to-cyan-100';
    if (color.includes('red')) return 'from-red-50 to-red-100';
    if (color.includes('yellow')) return 'from-yellow-50 to-yellow-100';
    return 'from-gray-50 to-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend.value).toFixed(1)}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend.label}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradientClass(iconColor)}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

