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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Analyzing your event with AI...</p>
          </div>
        ) : suggestions ? (
          <div className="space-y-6">
            {/* Youth Appeal Score */}
            <div className={`p-4 rounded-lg ${getScoreColor(suggestions.youthAppealScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Youth Appeal Score</p>
                  <p className="text-xs opacity-80">{getScoreLabel(suggestions.youthAppealScore)}</p>
                </div>
                <div className="text-4xl font-bold">{suggestions.youthAppealScore}/10</div>
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Overall Analysis</p>
                  <p className="text-sm text-blue-800">{suggestions.overallFeedback}</p>
                </div>
              </div>
            </div>

            {/* Suggested Title & Description */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Suggested Improvements
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Enhanced Title
                  </label>
                  <div className="bg-white p-3 rounded border border-indigo-200">
                    <p className="text-indigo-900 font-medium">{suggestions.title}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Improved Description
                  </label>
                  <div className="bg-white p-3 rounded border border-indigo-200">
                    <p className="text-indigo-900 text-sm whitespace-pre-wrap">
                      {suggestions.description}
                    </p>
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
              <ul className="space-y-2">
                {suggestions.marketingTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engagement Strategies */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Engagement Strategies
              </h4>
              <ul className="space-y-2">
                {suggestions.engagementStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Recommended Improvements
              </h4>
              <ul className="space-y-2">
                {suggestions.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => onAccept(suggestions.title, suggestions.description)}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                Accept Suggestions & Create Event
              </button>
              <button
                onClick={onProceedWithout}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Create with Original Details
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

