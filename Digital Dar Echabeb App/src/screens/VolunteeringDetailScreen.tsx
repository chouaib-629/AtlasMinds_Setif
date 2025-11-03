import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockVolunteeringProjects, VolunteeringProject } from '../lib/data';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ArrowRight, TreePine, Users, MapPin, Calendar, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/authContext';

interface VolunteeringDetailScreenProps {
  projectId: string;
  onBack: () => void;
  onCenterClick?: (centerId: string) => void;
}

export function VolunteeringDetailScreen({ projectId, onBack, onCenterClick }: VolunteeringDetailScreenProps) {
  const { t, language } = useApp();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState<VolunteeringProject | null>(
    () => mockVolunteeringProjects.find(p => p.id === projectId) || null
  );

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 mx-auto text-destructive" />
          <p className="text-destructive">{t('المشروع غير موجود', 'Project not found', 'Projet introuvable')}</p>
          <Button onClick={onBack} variant="outline">
            {t('العودة', 'Go Back', 'Retour')}
          </Button>
        </div>
      </div>
    );
  }

  const handleJoinZone = (zoneId: string) => {
    if (!isAuthenticated) {
      toast.error(t('يرجى تسجيل الدخول أولاً', 'Please login first', 'Veuillez vous connecter d\'abord'));
      return;
    }

    const zone = project.zones.find(z => z.id === zoneId);
    if (!zone) return;

    if (zone.status === 'full') {
      toast.info(t('هذه المنطقة ممتلئة', 'This zone is full', 'Cette zone est pleine'));
      return;
    }

    // Mock join logic
    toast.success(t('تم التسجيل في المنطقة بنجاح!', 'Successfully registered in the zone!', 'Inscription réussie dans la zone !'));
  };

  const totalPeopleNeeded = project.zones.reduce((sum, zone) => sum + zone.peopleNeeded, 0);
  const totalPeopleRegistered = project.zones.reduce((sum, zone) => sum + zone.peopleRegistered, 0);
  const totalTreesPlanted = project.zones.reduce((sum, zone) => sum + (zone.treesPlanted || 0), 0);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Hero Image */}
      <div className="relative h-64 bg-gradient-to-br from-green-500 to-emerald-600">
        {project.coverImage && (
          <img 
            src={project.coverImage} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <BackIcon className="w-6 h-6" />
        </button>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className={
            project.status === 'active' ? 'bg-green-600 text-white' :
            project.status === 'upcoming' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }>
            {project.status === 'active' ? t('نشط', 'Active', 'Actif') :
             project.status === 'upcoming' ? t('قادم', 'Upcoming', 'À venir') :
             t('منتهي', 'Completed', 'Terminé')}
          </Badge>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          {project.organizer && (
            <p className="text-sm opacity-90">{project.organizer}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {project.treesPlanted !== undefined && (
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <TreePine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {t('أشجار مزروعة', 'Trees Planted', 'Arbres plantés')}
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {project.treesPlanted.toLocaleString()}
                      {project.totalTrees && ` / ${project.totalTrees.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </Card>
            )}
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {t('متطوعون', 'Volunteers', 'Bénévoles')}
                  </p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {totalPeopleRegistered} / {totalPeopleNeeded}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('الوصف', 'Description', 'Description')}</h3>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Project Info */}
          {(project.startDate || project.endDate || project.wilaya) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">{t('معلومات المشروع', 'Project Information', 'Informations du projet')}</h3>
              <div className="space-y-2 text-sm">
                {project.startDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t('تاريخ البدء', 'Start Date', 'Date de début')}: {project.startDate}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t('تاريخ الانتهاء', 'End Date', 'Date de fin')}: {project.endDate}
                    </span>
                  </div>
                )}
                {project.wilaya && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{project.wilaya}</span>
                  </div>
                )}
                {project.organizerContact && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <button
                      onClick={() => window.open(`tel:${project.organizerContact}`, '_blank')}
                      className="text-primary hover:underline"
                    >
                      {project.organizerContact}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Planting Zones */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>{t('مناطق الزراعة', 'Planting Zones', 'Zones de plantation')}</span>
              <Badge variant="secondary" className="text-xs">
                {project.zones.length} {t('منطقة', 'zones', 'zones')}
              </Badge>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.zones.map((zone) => {
                const getStatusConfig = () => {
                  switch (zone.status) {
                    case 'open':
                      return {
                        label: t('مفتوحة', 'Open', 'Ouverte'),
                        icon: CheckCircle,
                        color: 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800',
                        iconColor: 'text-green-600 dark:text-green-400',
                      };
                    case 'full':
                      return {
                        label: t('ممتلئة', 'Full', 'Pleine'),
                        icon: XCircle,
                        color: 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800',
                        iconColor: 'text-orange-600 dark:text-orange-400',
                      };
                    case 'completed':
                      return {
                        label: t('مكتملة', 'Completed', 'Terminée'),
                        icon: CheckCircle,
                        color: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800',
                        iconColor: 'text-blue-600 dark:text-blue-400',
                      };
                    default:
                      return {
                        label: t('مفتوحة', 'Open', 'Ouverte'),
                        icon: CheckCircle,
                        color: 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950 dark:border-gray-800',
                        iconColor: 'text-gray-600 dark:text-gray-400',
                      };
                  }
                };

                const statusConfig = getStatusConfig();
                const StatusIcon = statusConfig.icon;
                const remaining = zone.peopleNeeded - zone.peopleRegistered;

                return (
                  <Card key={zone.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Zone Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{zone.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{zone.location}</span>
                          </div>
                        </div>
                        <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Zone Description */}
                      {zone.description && (
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      )}

                      {/* Zone Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('المتطوعون المطلوبون', 'People Needed', 'Bénévoles nécessaires')}</span>
                          <span className="font-semibold">{zone.peopleNeeded}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('المسجلون', 'Registered', 'Inscrits')}</span>
                          <span className="font-semibold">{zone.peopleRegistered}</span>
                        </div>
                        {remaining > 0 && (
                          <div className="flex items-center justify-between text-sm text-orange-600 dark:text-orange-400">
                            <span>{t('المتبقي', 'Remaining', 'Restant')}</span>
                            <span className="font-semibold">{remaining}</span>
                          </div>
                        )}
                        {zone.treesPlanted !== undefined && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <TreePine className="w-3 h-3" />
                              {t('أشجار مزروعة', 'Trees Planted', 'Arbres plantés')}
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {zone.treesPlanted.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{t('التقدم', 'Progress', 'Progression')}</span>
                          <span>{Math.round((zone.peopleRegistered / zone.peopleNeeded) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((zone.peopleRegistered / zone.peopleNeeded) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Join Button */}
                      <Button
                        onClick={() => handleJoinZone(zone.id)}
                        className="w-full"
                        variant={zone.status === 'full' ? 'secondary' : 'default'}
                        disabled={zone.status === 'full' || !isAuthenticated}
                      >
                        {zone.status === 'full' 
                          ? t('ممتلئة', 'Full', 'Pleine')
                          : !isAuthenticated
                          ? t('سجل الدخول للانضمام', 'Login to Join', 'Connectez-vous pour rejoindre')
                          : t('انضم إلى المنطقة', 'Join Zone', 'Rejoindre la zone')}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

