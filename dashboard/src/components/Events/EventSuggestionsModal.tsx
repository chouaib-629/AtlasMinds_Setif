'use client';

import { useState } from 'react';
import { Sparkles, X, CheckCircle2, TrendingUp, Lightbulb, Target, MessageSquare } from 'lucide-react';

interface EventSuggestions {
  title: string;
  description: string;
  marketingTips: string[];
  engagementStrategies: string[];
  improvements: string[];
  youthAppealScore: number;
  originalYouthAppealScore: number;
  overallFeedback: string;
}

interface EventSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: EventSuggestions | null;
  onAccept: (suggestedTitle: string, suggestedDescription: string) => void;
  onProceedWithout: () => void;
  loading?: boolean;
}

export default function EventSuggestionsModal({
  isOpen,
  onClose,
  suggestions,
  onAccept,
  onProceedWithout,
  loading = false,
}: EventSuggestionsModalProps) {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">AI Event Analysis</h3>
              <p className="text-gray-600 text-sm">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && !suggestions ? (
          <div className="text-center py-12">
            <div className="inline-block rounded-full animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Analyzing your event with AI...</p>
          </div>
        ) : suggestions || loading ? (
          <div className="space-y-6">
            {/* Youth Appeal Scores Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Score */}
              <div className={`p-4 rounded-lg border-2 ${loading ? 'bg-gray-50 border-gray-300' : getScoreColor(suggestions?.originalYouthAppealScore || suggestions?.youthAppealScore || 5)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <p className="text-sm font-medium">Original Score</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded mb-1"></div>
                    ) : (
                      <p className="text-xs opacity-80 mb-1">{getScoreLabel(suggestions?.originalYouthAppealScore || suggestions?.youthAppealScore || 5)}</p>
                    )}
                  </div>
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
                  ) : (
                    <div className="text-4xl font-bold">{(suggestions?.originalYouthAppealScore || suggestions?.youthAppealScore || 5)}/10</div>
                  )}
                </div>
              </div>
              
              {/* Suggested Score */}
              <div className={`p-4 rounded-lg border-2 ${loading ? 'bg-gray-50 border-gray-300' : getScoreColor(suggestions?.youthAppealScore || 5)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <p className="text-sm font-medium">Suggested Score</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded mb-1"></div>
                    ) : (
                      <p className="text-xs opacity-80 mb-1">{getScoreLabel(suggestions?.youthAppealScore || 5)}</p>
                    )}
                  </div>
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
                  ) : (
                    <div className="text-4xl font-bold">{(suggestions?.youthAppealScore || 5)}/10</div>
                  )}
                </div>
                {!loading && suggestions && (suggestions.youthAppealScore > (suggestions.originalYouthAppealScore || suggestions.youthAppealScore)) && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    +{(suggestions.youthAppealScore - (suggestions.originalYouthAppealScore || suggestions.youthAppealScore))} points improvement
                  </div>
                )}
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">Overall Analysis</p>
                  {loading ? (
                    <div className="space-y-2">
                      <div className="animate-pulse bg-blue-100 h-4 w-full rounded"></div>
                      <div className="animate-pulse bg-blue-100 h-4 w-5/6 rounded"></div>
                      <div className="animate-pulse bg-blue-100 h-4 w-4/6 rounded"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800">{suggestions?.overallFeedback || ''}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Original vs Suggested Title & Description */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Your Values vs AI Suggestions
              </h4>
              
              <div className="space-y-4">
                {/* Title Comparison */}
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Title
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Original Title */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Your Original
                      </div>
                      <div className="bg-white p-3 rounded border border-blue-300 min-h-[60px]">
                        <p className="text-gray-900 font-medium text-sm">
                          {suggestions.originalTitle || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {/* Suggested Title */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        AI Suggested
                      </div>
                      <div className="bg-indigo-50 p-3 rounded border-2 border-indigo-300 min-h-[60px]">
                        {loading ? (
                          <div className="animate-pulse bg-indigo-100 h-5 w-full rounded"></div>
                        ) : (
                          <p className="text-indigo-900 font-medium text-sm">
                            {suggestions?.title || ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description Comparison */}
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-2">
                    Description
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Original Description */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Your Original
                      </div>
                      <div className="bg-white p-3 rounded border border-blue-300 min-h-[120px]">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {suggestions.originalDescription || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {/* Suggested Description */}
                    <div>
                      <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        AI Suggested
                      </div>
                      <div className="bg-indigo-50 p-3 rounded border-2 border-indigo-300 min-h-[120px]">
                        {loading ? (
                          <div className="space-y-2">
                            <div className="animate-pulse bg-indigo-100 h-3 w-full rounded"></div>
                            <div className="animate-pulse bg-indigo-100 h-3 w-full rounded"></div>
                            <div className="animate-pulse bg-indigo-100 h-3 w-5/6 rounded"></div>
                            <div className="animate-pulse bg-indigo-100 h-3 w-4/6 rounded"></div>
                          </div>
                        ) : (
                          <p className="text-indigo-900 text-sm whitespace-pre-wrap">
                            {suggestions?.description || ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Tips */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Marketing Tips
              </h4>
              {loading ? (
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="animate-pulse bg-gray-200 h-4 w-4 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {(suggestions?.marketingTips || []).map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Engagement Strategies */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Engagement Strategies
              </h4>
              {loading ? (
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="animate-pulse bg-gray-200 h-4 w-4 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {(suggestions?.engagementStrategies || []).map((strategy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strategy}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Improvements */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Recommended Improvements
              </h4>
              {loading ? (
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="animate-pulse bg-gray-200 h-4 w-4 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {(suggestions?.improvements || []).map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onProceedWithout}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save with Original Values
              </button>
              <button
                onClick={() => suggestions && onAccept(suggestions.title, suggestions.description)}
                disabled={loading || !suggestions}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save with AI Suggestions
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No suggestions available</p>
          </div>
        )}
      </div>
    </div>
  );
}

