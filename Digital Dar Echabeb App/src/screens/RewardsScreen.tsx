import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockRewards } from '../lib/data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Gift, Coins, Star, Ticket, Dumbbell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '../components/BackButton';

interface RewardsScreenProps {
  onBack?: () => void;
}

export function RewardsScreen({ onBack }: RewardsScreenProps = {}) {
  const { t } = useApp();
  const [coinBalance] = useState(1250);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const categories = [
    { id: 'all', label: t('الكل', 'All'), icon: Gift },
    { id: 'priority', label: t('أولوية', 'Priority'), icon: Star },
    { id: 'voucher', label: t('قسائم', 'Vouchers'), icon: Ticket },
    { id: 'equipment', label: t('معدات', 'Equipment'), icon: Dumbbell },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRewards = selectedCategory === 'all'
    ? mockRewards
    : mockRewards.filter(r => r.category === selectedCategory);

  const handleRedeem = (reward: any) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    setShowRedeemModal(false);
    toast.success(t('تم الاستبدال بنجاح!', 'Redeemed successfully!'));
  };

  return (
    <div className="pb-20">
      {/* Header with Balance */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <BackButton onClick={onBack} className="text-white hover:bg-white/20" />}
            <h2>{t('متجر الجوائز', 'Rewards Store')}</h2>
          </div>
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('رصيدك', 'Your Balance')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-6 h-6" />
                <span className="text-2xl">{coinBalance.toLocaleString()}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              {t('كيف أربح المزيد؟', 'How to earn more?')}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              coinBalance={coinBalance}
              onRedeem={handleRedeem}
            />
          ))}
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('لا توجد جوائز في هذه الفئة', 'No rewards in this category')}</p>
          </div>
        )}
      </div>

      {/* Redeem Modal */}
      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('استبدال الجائزة', 'Redeem Reward')}</DialogTitle>
            <DialogDescription>
              {t('هل تريد استبدال هذه الجائزة؟', 'Do you want to redeem this reward?')}
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3>{selectedReward.title}</h3>
                <p className="text-muted-foreground">{selectedReward.description}</p>
                <div className="flex items-center gap-2 text-primary">
                  <Coins className="w-5 h-5" />
                  <span>{selectedReward.cost} {t('نقطة', 'points')}</span>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {t('الرصيد المتبقي بعد الاستبدال:', 'Balance after redemption:')}
                </p>
                <p className="text-xl">{(coinBalance - selectedReward.cost).toLocaleString()} {t('نقطة', 'points')}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowRedeemModal(false)} className="flex-1">
                  {t('إلغاء', 'Cancel')}
                </Button>
                <Button onClick={confirmRedeem} className="flex-1" disabled={coinBalance < selectedReward.cost}>
                  {t('استبدال', 'Redeem')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface RewardCardProps {
  reward: any;
  coinBalance: number;
  onRedeem: (reward: any) => void;
}

function RewardCard({ reward, coinBalance, onRedeem }: RewardCardProps) {
  const { t } = useApp();
  const canAfford = coinBalance >= reward.cost;

  const categoryIcons = {
    priority: Star,
    voucher: Ticket,
    equipment: Dumbbell,
  };

  const categoryColors = {
    priority: 'from-yellow-400 to-orange-500',
    voucher: 'from-green-400 to-teal-500',
    equipment: 'from-blue-400 to-purple-500',
  };

  const Icon = categoryIcons[reward.category as keyof typeof categoryIcons];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className={`h-32 bg-gradient-to-br ${categoryColors[reward.category as keyof typeof categoryColors]} flex items-center justify-center`}>
        <Icon className="w-16 h-16 text-white" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="mb-1">{reward.title}</h3>
          <p className="text-muted-foreground">{reward.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-primary">{reward.cost}</span>
          </div>

          {!reward.available ? (
            <Badge variant="secondary">{t('غير متاح', 'Unavailable')}</Badge>
          ) : !canAfford ? (
            <Badge variant="destructive">{t('رصيد غير كافٍ', 'Insufficient balance')}</Badge>
          ) : null}
        </div>

        <Button
          onClick={() => onRedeem(reward)}
          className="w-full"
          disabled={!reward.available || !canAfford}
        >
          {t('استبدال', 'Redeem')}
        </Button>
      </div>
    </div>
  );
}
