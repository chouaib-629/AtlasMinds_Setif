import React from 'react';
import { Home, Lightbulb, Trophy, User } from 'lucide-react';
import { useApp } from '../lib/context';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useApp();

  const tabs = [
    { id: 'home', icon: Home, label: t('الرئيسية', 'Home', 'Accueil') },
    { id: 'insights', icon: Lightbulb, label: t('رؤى', 'Insights', 'Aperçus') },
    { id: 'leaderboard', icon: Trophy, label: t('لوحة المتصدرين', 'Leaderboard', 'Classement') },
    { id: 'profile', icon: User, label: t('ملف', 'Profile', 'Profil') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
