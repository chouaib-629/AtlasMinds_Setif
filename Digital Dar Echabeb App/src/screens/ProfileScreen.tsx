import React from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Settings, Moon, Sun, Languages, Bell, User as UserIcon, Trophy, Flame, Award, LogOut, Shield, Building } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { toast } from 'sonner@2.0.3';

interface ProfileScreenProps {
  onOpenLocalAdmin?: () => void;
  onOpenCentralAdmin?: () => void;
}

export function ProfileScreen({ onOpenLocalAdmin, onOpenCentralAdmin }: ProfileScreenProps = {}) {
  const { t, theme, setTheme, language, setLanguage } = useApp();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('تم تسجيل الخروج بنجاح', 'Logged out successfully'));
      // Navigation will be handled by auth state change
    } catch (error) {
      toast.error(t('حدث خطأ أثناء تسجيل الخروج', 'Error logging out'));
    }
  };

  const stats = [
    { label: t('النقاط', 'Points'), value: '1,850', icon: Trophy },
    { label: t('السلسلة', 'Streak'), value: '12', icon: Flame },
    { label: t('الشارات', 'Badges'), value: '8', icon: Award },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1">{user ? `${user.prenom} ${user.nom}` : t('أحمد محمد', 'Ahmed Mohamed')}</h2>
            <p className="opacity-90">{user?.email || 'ahmed@example.com'}</p>
            <Badge className="mt-2 bg-yellow-400 text-yellow-900">
              {t('ذهبي', 'Gold')}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xl">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Y-Pass Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl space-y-3">
          <h3>{t('بطاقة Y-Pass', 'Y-Pass Card')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="opacity-90">{t('المستوى', 'Level')}</span>
              <span>{t('ذهبي', 'Gold')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-90">{t('رقم العضوية', 'Member ID')}</span>
              <span>DEC-2024-00123</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-90">{t('عضو منذ', 'Member Since')}</span>
              <span>{t('أكتوبر 2024', 'October 2024')}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h3>{t('الإعدادات', 'Settings')}</h3>

          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {/* Theme Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <span>{t('الوضع الداكن', 'Dark Mode')}</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            {/* Language Switcher */}
            <div className="p-4">
              <LanguageSwitcher variant="full" />
            </div>

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>{t('الإشعارات', 'Notifications')}</span>
              </div>
              <Switch defaultChecked />
            </div>

            {/* Account Settings */}
            <button className="p-4 w-full flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span>{t('إعدادات الحساب', 'Account Settings')}</span>
            </button>
          </div>
        </div>

        {/* My Activity */}
        <div className="space-y-3">
          <h3>{t('نشاطي', 'My Activity', 'Mon activité')}</h3>
          
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <button className="p-4 w-full text-right hover:bg-muted/50 transition-colors">
              {t('حجوزاتي', 'My Bookings', 'Mes réservations')}
            </button>
            <button className="p-4 w-full text-right hover:bg-muted/50 transition-colors">
              {t('مواعيدي', 'My Appointments', 'Mes rendez-vous')}
            </button>
            <button className="p-4 w-full text-right hover:bg-muted/50 transition-colors">
              {t('التطوع', 'Volunteering', 'Bénévolat')}
            </button>
            <button className="p-4 w-full text-right hover:bg-muted/50 transition-colors">
              {t('اقتراحاتي', 'My Suggestions', 'Mes suggestions')}
            </button>
            <button className="p-4 w-full text-right hover:bg-muted/50 transition-colors">
              {t('المفضلة', 'Favorites', 'Favoris')}
            </button>
          </div>
        </div>

        {/* Admin Access (Demo) */}
        {(onOpenLocalAdmin || onOpenCentralAdmin) && (
          <div className="space-y-3">
            <h3>{t('الوصول الإداري', 'Admin Access', 'Accès admin')}</h3>
            
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {onOpenLocalAdmin && (
                <button 
                  onClick={onOpenLocalAdmin}
                  className="p-4 w-full flex items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <Building className="w-5 h-5 text-primary" />
                  <span>{t('إدارة المركز المحلي', 'Local Center Admin', 'Admin centre local')}</span>
                </button>
              )}
              {onOpenCentralAdmin && (
                <button 
                  onClick={onOpenCentralAdmin}
                  className="p-4 w-full flex items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  <Shield className="w-5 h-5 text-destructive" />
                  <span>{t('الإدارة المركزية', 'Central Administration', 'Administration centrale')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive" 
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 ml-2" />
          {t('تسجيل الخروج', 'Logout')}
        </Button>

        {/* App Info */}
        <div className="text-center text-muted-foreground text-sm space-y-1 pt-4">
          <p>{t('دار الشباب الرقمية', 'Digital Youth Center')}</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
