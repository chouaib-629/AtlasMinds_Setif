import React from 'react';
import { Activity } from '../lib/types';
import { useApp } from '../lib/context';
import { Calendar, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  onCenterClick?: (centerId: string) => void;
}

export function ActivityCard({ activity, onClick, onCenterClick }: ActivityCardProps) {
  const { t } = useApp();

  const categoryColors = {
    sports: 'bg-blue-500',
    learning: 'bg-purple-500',
    social: 'bg-pink-500',
    environmental: 'bg-green-500',
    'e-sport': 'bg-orange-500',
  };

  const typeLabels = {
    free: t('مجاني', 'Free'),
    paid: t('مدفوع', 'Paid'),
    virtual: t('افتراضي', 'Virtual'),
  };

  const categoryLabels = {
    sports: t('رياضة', 'Sports'),
    learning: t('تعليم', 'Learning'),
    social: t('اجتماعي', 'Social'),
    environmental: t('بيئي', 'Environmental'),
    'e-sport': t('رياضة إلكترونية', 'E-Sports'),
  };

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden border border-border cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        {activity.image ? (
          <ImageWithFallback
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${categoryColors[activity.category]}`} />
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className="bg-background/90 text-foreground">
            {typeLabels[activity.type]}
          </Badge>
          <Badge className={`${categoryColors[activity.category]} text-white`}>
            {categoryLabels[activity.category]}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="line-clamp-2">{activity.title}</h3>
        
        <p className="text-muted-foreground line-clamp-2">
          {activity.description}
        </p>

        <div className="flex flex-col gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {onCenterClick && activity.centerId ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCenterClick(activity.centerId);
                }}
                className="text-sm hover:underline text-left"
              >
                {activity.centerName}
              </button>
            ) : (
              <span className="text-sm">{activity.centerName}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{activity.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{activity.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {activity.registered}/{activity.capacity}
            </span>
          </div>

          {activity.type === 'paid' && activity.price && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{activity.price} {t('دج', 'DZD')}</span>
            </div>
          )}
        </div>

        <Button className="w-full" size="lg">
          {t('احجز الآن', 'Book Now')}
        </Button>
      </div>
    </div>
  );
}
