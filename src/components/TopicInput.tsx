import React from 'react';
import { X, Plus } from 'lucide-react';

interface TopicInputProps {
  topics: string[];
  onAddTopic: (topic: string) => void;
  onRemoveTopic: (index: number) => void;
}

export default function TopicInput({ topics, onAddTopic, onRemoveTopic }: TopicInputProps) {
  const [newTopic, setNewTopic] = React.useState('');

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      onAddTopic(newTopic.trim());
      setNewTopic('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Topics
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
          placeholder="Add a topic (e.g., Leadership, Technical Skills)"
        />
        <button
          type="button"
          onClick={handleAddTopic}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
          >
            <span>{topic}</span>
            <button
              type="button"
              onClick={() => onRemoveTopic(index)}
              className="hover:text-blue-600 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}