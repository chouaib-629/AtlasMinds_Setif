import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';
import { 
  MapPin, 
  Users, 
  Star, 
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { BackButton } from '../components/BackButton';

interface CenterDetailScreenProps {
  centerId: string;
  onBack: () => void;
  onActivityClick: (activityId: string) => void;
  onBookAppointment?: (centerId: string, centerName: string) => void;
}

export function CenterDetailScreen({ centerId, onBack, onActivityClick, onBookAppointment }: CenterDetailScreenProps) {
  const { t, language } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState('calendar');

  // Mock data
  const center = {
    id: centerId,
    name: 'دار الشباب المركزي',
    wilaya: 'الجزائر',
    address: 'حي بئر مراد رايس',
    phone: '+213 555 123 456',
    email: 'contact@daralshabab-central.dz',
    website: 'www.daralshabab-central.dz',
    memberCount: 450,
    rating: 4.5,
    capacity: 300,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
    description: 'دار الشباب المركزي هو مركز رائد يقدم مجموعة واسعة من الأنشطة والبرامج للشباب في مختلف المجالات',
  };

  const weeklySchedule = [
    {
      day: 'الأحد',
      programs: [
        { time: '09:00 - 11:00', title: 'كرة السلة للمبتدئين', category: 'sports', available: 15 },
        { time: '14:00 - 16:00', title: 'ورشة الرسم', category: 'learning', available: 8 },
        { time: '16:00 - 18:00', title: 'نادي الشطرنج', category: 'social', available: 12 },
      ],
    },
    {
      day: 'الإثنين',
      programs: [
        { time: '10:00 - 12:00', title: 'يوغا للمبتدئين', category: 'sports', available: 10 },
        { time: '14:00 - 16:00', title: 'ورشة البرمجة', category: 'learning', available: 5 },
        { time: '17:00 - 19:00', title: 'تدريب كرة القدم', category: 'sports', available: 0 },
      ],
    },
    {
      day: 'الثلاثاء',
      programs: [
        { time: '09:00 - 11:00', title: 'دروس الموسيقى', category: 'learning', available: 7 },
        { time: '14:00 - 16:00', title: 'نادي الكتاب', category: 'social', available: 20 },
        { time: '16:00 - 18:00', title: 'كاراتيه للأطفال', category: 'sports', available: 6 },
      ],
    },
    {
      day: 'الأربعاء',
      programs: [
        { time: '10:00 - 12:00', title: 'ورشة التصوير', category: 'learning', available: 12 },
        { time: '14:00 - 16:00', title: 'تنس الطاولة', category: 'sports', available: 8 },
        { time: '17:00 - 19:00', title: 'حلقة نقاش شبابي', category: 'social', available: 15 },
      ],
    },
    {
      day: 'الخميس',
      programs: [
        { time: '09:00 - 11:00', title: 'طبخ للمبتدئين', category: 'learning', available: 5 },
        { time: '14:00 - 16:00', title: 'ورشة الخط العربي', category: 'learning', available: 10 },
        { time: '15:00 - 17:00', title: 'بطولة FIFA', category: 'e-sport', available: 4 },
      ],
    },
    {
      day: 'الجمعة',
      programs: [
        { time: '09:00 - 11:00', title: 'رياضة صباحية', category: 'sports', available: 20 },
        { time: '15:00 - 18:00', title: 'سينما الشباب', category: 'social', available: 25 },
      ],
    },
    {
      day: 'السبت',
      programs: [
        { time: '10:00 - 12:00', title: 'تطوع بيئي', category: 'environmental', available: 18 },
        { time: '14:00 - 17:00', title: 'ورشة ريادة الأعمال', category: 'learning', available: 15 },
        { time: '17:00 - 19:00', title: 'بطولة كرة القدم', category: 'sports', available: 0 },
      ],
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      sports: 'bg-blue-500',
      learning: 'bg-green-500',
      social: 'bg-purple-500',
      environmental: 'bg-emerald-500',
      'e-sport': 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${center.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <BackButton onClick={onBack} className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70" />
        </div>

        {/* Center Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl mb-2">{center.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{center.wilaya}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span>{center.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{center.memberCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 pb-20">
        {/* About */}
        <Card className="p-4">
          <h2 className="mb-3">{t('عن المركز', 'About', 'À propos')}</h2>
          <p className="text-sm text-muted-foreground mb-4">{center.description}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{center.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{center.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{center.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{center.website}</span>
            </div>
          </div>
        </Card>

        {/* Schedule Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="calendar">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {t('التقويم الأسبوعي', 'Weekly Calendar', 'Calendrier hebdomadaire')}
            </TabsTrigger>
            <TabsTrigger value="month">
              {t('الشهر', 'Month', 'Mois')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg">
                {t('البرامج الأسبوعية', 'Weekly Programs', 'Programmes hebdomadaires')}
              </h2>
            </div>

            {weeklySchedule.map((day, index) => (
              <Card key={index} className="p-4">
                <h3 className="mb-3 text-primary">{day.day}</h3>
                <div className="space-y-3">
                  {day.programs.map((program, pIndex) => (
                    <div 
                      key={pIndex}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className={`w-1 h-12 rounded-full ${getCategoryColor(program.category)}`} />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">{program.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{program.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs mb-1">
                          {program.category}
                        </Badge>
                        <div className={`text-xs ${program.available === 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {program.available === 0 
                            ? t('ممتلئ', 'Full', 'Complet')
                            : `${program.available} ${t('مقعد', 'seats', 'places')}`
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="month" className="mt-4">
            <Card className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="mb-3">
                    {t('أنشطة ', 'Activities on ', 'Activités le ')}
                    {selectedDate.toLocaleDateString('ar-DZ')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('لا توجد أنشطة في هذا التاريخ', 'No activities on this date', 'Aucune activité à cette date')}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => {
            if (onBookAppointment) {
              onBookAppointment(centerId, center.name);
            }
          }}
        >
          {t('حجز موعد', 'Book Appointment', 'Réserver un rendez-vous')}
        </Button>
      </div>
    </div>
  );
}
