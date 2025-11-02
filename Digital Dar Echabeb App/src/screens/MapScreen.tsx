import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockCenters } from '../lib/data';
import { CenterCard } from '../components/CenterCard';
import { Search, Filter, MapPin, List } from 'lucide-react';
import { Input } from '../components/ui/input';

interface MapScreenProps {
  onCenterClick: (centerId: string) => void;
}

export function MapScreen({ onCenterClick }: MapScreenProps) {
  const { t } = useApp();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    { id: 'sports', label: t('رياضة', 'Sports') },
    { id: 'learning', label: t('تعليم', 'Learning') },
    { id: 'social', label: t('اجتماعي', 'Social') },
    { id: 'environmental', label: t('بيئي', 'Environmental') },
    { id: 'e-sport', label: t('رياضة إلكترونية', 'E-Sports') },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="h-screen flex flex-col pb-20">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('ابحث عن مركز...', 'Search for center...')}
                className="pr-10"
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {viewMode === 'map' ? (
                <List className="w-6 h-6" />
              ) : (
                <MapPin className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedFilters.includes(filter.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map / List View */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'map' ? (
          <div className="relative h-full">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-muted">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {/* Simple map representation */}
                <div className="relative w-full h-full">
                  {/* Map background with Algeria-themed colors */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950" />
                  
                  {/* Map pins for centers */}
                  {mockCenters.map((center, index) => (
                    <button
                      key={center.id}
                      onClick={() => onCenterClick(center.id)}
                      className="absolute transform -translate-x-1/2 -translate-y-full"
                      style={{
                        left: `${30 + index * 20}%`,
                        top: `${40 + index * 10}%`,
                      }}
                    >
                      <div className="relative">
                        <MapPin className="w-10 h-10 text-destructive fill-destructive drop-shadow-lg" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border border-border rounded-lg px-2 py-1 whitespace-nowrap text-xs shadow-lg">
                          {center.name}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* User location indicator */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                      <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearest Centers List (Bottom Sheet Style) */}
            <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl border-t border-border shadow-2xl max-h-[40vh] overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3>{t('الأقرب إليك', 'Nearest to You')}</h3>
                  <span className="text-muted-foreground">
                    {mockCenters.length} {t('مركز', 'centers')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {mockCenters.map((center) => (
                    <CenterCard
                      key={center.id}
                      center={center}
                      onClick={() => onCenterClick(center.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3>{t('جميع المراكز', 'All Centers')}</h3>
              <span className="text-muted-foreground">
                {mockCenters.length} {t('مركز', 'centers')}
              </span>
            </div>
            
            {mockCenters.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                onClick={() => onCenterClick(center.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
