import React from 'react';
import { RefreshCw, X } from 'lucide-react';

interface FeedbackSectionProps {
  questionNumber: number;
  question: string;
  initialFeedback: string;
  refinedFeedback: string | null;
  onQuestionChange: (question: string) => void;
  onFeedbackChange: (feedback: string) => void;
  onRegenerate: () => void;
  onRemove: () => void;
  isLoading: boolean;
  canRemove: boolean;
  tone: string;
  onToneChange: (tone: string) => void;

}

const WORD_LIMIT = 250;
const RECOMMENDED_WORDS = 200;
export const TONE_DICT: { [key: number]: string } = {
  1: 'Extremely Negative',
  2: 'Negative',
  3: 'Neutral',
  4: 'Positive',
  5: 'Extremely Positive'
}

export default function FeedbackSection({
  questionNumber,
  question,
  initialFeedback,
  refinedFeedback,
  onQuestionChange,
  onFeedbackChange,
  onRegenerate,
  onRemove,
  isLoading,
  canRemove,
  tone,
  onToneChange
}: FeedbackSectionProps) {
  const wordCount = initialFeedback.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > WORD_LIMIT;

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Question {questionNumber}
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your question..."
          />

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Tone
            </label>
            <div className="flex space-x-2 mt-1">
              {Object.values(TONE_DICT).map((value) => (
                <button
                  key={value}
                  onClick={() => onToneChange(value)}
                  className={`px-3 py-1 rounded-md ${
                    tone === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600"
            title="Remove question"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Initial Feedback
            </label>
            <span className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {wordCount}/{WORD_LIMIT} words
              <span className="text-gray-400 ml-1">
                (Recommended: {RECOMMENDED_WORDS})
              </span>
            </span>
          </div>
          <textarea
            value={initialFeedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            rows={4}
            className={`w-full rounded-md shadow-sm focus:ring-blue-500 ${
              isOverLimit 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your initial feedback..."
          />
          {isOverLimit && (
            <p className="mt-1 text-sm text-red-600">
              Please reduce your feedback to {WORD_LIMIT} words or less
            </p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Refined Feedback
            </label>
            <button
              onClick={onRegenerate}
              disabled={isLoading || !initialFeedback || isOverLimit}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
          </div>
          <div className="bg-gray-50 rounded-md p-3 h-[108px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </div>
            ) : refinedFeedback ? (
              <p className="text-gray-700 whitespace-pre-wrap">{refinedFeedback}</p>
            ) : (
              <p className="text-gray-500 italic text-center">
                Refined feedback will appear here after generation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}