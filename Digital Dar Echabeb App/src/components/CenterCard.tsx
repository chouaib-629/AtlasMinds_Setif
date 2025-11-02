import React from 'react';
import { Center } from '../lib/types';
import { useApp } from '../lib/context';
import { MapPin, Star, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface CenterCardProps {
  center: Center;
  onClick?: () => void;
}

export function CenterCard({ center, onClick }: CenterCardProps) {
  const { t } = useApp();

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="mb-1">{center.name}</h3>
          <p className="text-muted-foreground">{center.wilaya}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span>{center.rating}</span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-muted-foreground mb-3">
        <MapPin className="w-4 h-4 mt-1 shrink-0" />
        <p className="text-sm">{center.address}</p>
      </div>

      {center.distance !== undefined && center.eta !== undefined && (
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Navigation className="w-4 h-4" />
            <span>{center.distance} {t('كم', 'km')}</span>
          </div>
          <div>
            <span>{center.eta} {t('دقيقة', 'min')}</span>
          </div>
        </div>
      )}

      <Button className="w-full" variant="outline">
        {t('عرض التفاصيل', 'View Details')}
      </Button>
    </div>
  );
}
