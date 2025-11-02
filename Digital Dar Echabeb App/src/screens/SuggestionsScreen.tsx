import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockSuggestions } from '../lib/data';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ThumbsUp, MessageCircle, Plus, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { BackButton } from '../components/BackButton';

interface SuggestionsScreenProps {
  onBack?: () => void;
}

export function SuggestionsScreen({ onBack }: SuggestionsScreenProps = {}) {
  const { t } = useApp();
  const [showNewSuggestionModal, setShowNewSuggestionModal] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'top'>('latest');
  const [votedSuggestions, setVotedSuggestions] = useState<Set<string>>(new Set());

  const handleVote = (suggestionId: string) => {
    if (votedSuggestions.has(suggestionId)) {
      toast.error(t('لقد صوتت بالفعل', 'You already voted'));
      return;
    }
    
    setVotedSuggestions(prev => new Set([...prev, suggestionId]));
    toast.success(t('تم التصويت', 'Voted'));
  };

  const handleSubmitSuggestion = () => {
    setShowNewSuggestionModal(false);
    toast.success(t('تم إرسال الاقتراح بنجاح', 'Suggestion submitted successfully'));
  };

  const sortedSuggestions = [...mockSuggestions].sort((a, b) => {
    if (sortBy === 'top') {
      return b.votes - a.votes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && <BackButton onClick={onBack} />}
              <h2>{t('الاقتراحات', 'Suggestions')}</h2>
            </div>
            <Button onClick={() => setShowNewSuggestionModal(true)} size="sm">
              <Plus className="w-5 h-5 ml-2" />
              {t('اقتراح جديد', 'New')}
            </Button>
          </div>

          {/* Sort Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'latest'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Clock className="w-4 h-4" />
              {t('الأحدث', 'Latest')}
            </button>
            <button
              onClick={() => setSortBy('top')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'top'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {t('الأكثر تصويتاً', 'Top Voted')}
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="p-4 space-y-4">
        {sortedSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            hasVoted={votedSuggestions.has(suggestion.id)}
            onVote={handleVote}
          />
        ))}

        {sortedSuggestions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t('لا توجد اقتراحات بعد', 'No suggestions yet')}</p>
            <Button onClick={() => setShowNewSuggestionModal(true)} className="mt-4">
              {t('كن أول من يقترح', 'Be the first to suggest')}
            </Button>
          </div>
        )}
      </div>

      {/* New Suggestion Modal */}
      <Dialog open={showNewSuggestionModal} onOpenChange={setShowNewSuggestionModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('اقتراح جديد', 'New Suggestion')}</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmitSuggestion(); }}>
            <div className="space-y-2">
              <label htmlFor="title">{t('العنوان', 'Title')}</label>
              <Input
                id="title"
                placeholder={t('اقتراحك في سطر واحد', 'Your suggestion in one line')}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description">{t('الوصف', 'Description')}</label>
              <Textarea
                id="description"
                placeholder={t('اشرح اقتراحك بالتفصيل', 'Explain your suggestion in detail')}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category">{t('الفئة', 'Category')}</label>
              <select
                id="category"
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg"
                required
              >
                <option value="">{t('اختر الفئة', 'Select category')}</option>
                <option value="sports">{t('رياضة', 'Sports')}</option>
                <option value="learning">{t('تعليم', 'Learning')}</option>
                <option value="social">{t('اجتماعي', 'Social')}</option>
                <option value="environmental">{t('بيئي', 'Environmental')}</option>
                <option value="e-sport">{t('رياضة إلكترونية', 'E-Sports')}</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNewSuggestionModal(false)} className="flex-1">
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button type="submit" className="flex-1">
                {t('إرسال', 'Submit')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: any;
  hasVoted: boolean;
  onVote: (id: string) => void;
}

function SuggestionCard({ suggestion, hasVoted, onVote }: SuggestionCardProps) {
  const { t } = useApp();
  const [showComments, setShowComments] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
  };

  const statusLabels = {
    pending: t('قيد المراجعة', 'Pending'),
    approved: t('تمت الموافقة', 'Approved'),
    rejected: t('مرفوض', 'Rejected'),
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="mb-1">{suggestion.title}</h3>
          <p className="text-muted-foreground line-clamp-2 mb-2">
            {suggestion.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{suggestion.userName}</span>
            <span>•</span>
            <span>{suggestion.wilaya}</span>
            <span>•</span>
            <span>{suggestion.createdAt}</span>
          </div>
        </div>
        <Badge className={`${statusColors[suggestion.status as keyof typeof statusColors]} text-white`}>
          {statusLabels[suggestion.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onVote(suggestion.id)}
          disabled={hasVoted}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasVoted
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{suggestion.votes}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{suggestion.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-border pt-3 space-y-3">
          {suggestion.comments.length > 0 ? (
            suggestion.comments.map((comment: any) => (
              <div key={comment.id} className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 text-sm">
                  <span>{comment.userName}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{comment.createdAt}</span>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {t('لا توجد تعليقات بعد', 'No comments yet')}
            </p>
          )}
          
          <div className="flex gap-2">
            <Input placeholder={t('اكتب تعليقاً...', 'Write a comment...')} />
            <Button size="sm">{t('إرسال', 'Send')}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
