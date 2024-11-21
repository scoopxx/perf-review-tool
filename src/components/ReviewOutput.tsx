import React from 'react';
import { ClipboardCopy } from 'lucide-react';

interface ReviewOutputProps {
  review: string | null;
}

export default function ReviewOutput({ review }: ReviewOutputProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (review) {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!review) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Professional Review</h3>
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ClipboardCopy className="h-4 w-4 mr-1" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{review}</p>
      </div>
    </div>
  );
}