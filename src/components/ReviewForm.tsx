import React from 'react';
import { Send, Plus } from 'lucide-react';
import TopicInput from './TopicInput';
import FeedbackSection from './FeedbackSection';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ReviewFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

interface FeedbackSection {
  question: string;
  initial: string;
  refined: string | null;
  tone: string;
}

interface FormData {
  name: string;
  gender: string;
  position: string;
  relationship: string;
  topics: string[];
  feedbackSections: FeedbackSection[];
}

const defaultQuestions = [
  "Describe examples of the topic selected. What was the context? What actions did they take?",
  "In your opinion, what impact did {name}'s actions have?",
  "What recommendation do you have for {name}'s growth and development? Your feedback can be about any area of their work."
];

export default function ReviewForm({ onSubmit, isLoading }: ReviewFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    gender: '',
    position: '',
    relationship: '',
    topics: [],
    feedbackSections: defaultQuestions.map(q => ({
      question: q,
      initial: '',
      refined: null,
      tone: ''
    }))
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleAddTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, topic]
    }));
  };

  const handleRemoveTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleFeedbackChange = (index: number, feedback: string) => {
    setFormData(prev => ({
      ...prev,
      feedbackSections: prev.feedbackSections.map((section, i) =>
        i === index ? { ...section, initial: feedback } : section
      )
    }));
  };

  const handleQuestionChange = (index: number, question: string) => {
    setFormData(prev => ({
      ...prev,
      feedbackSections: prev.feedbackSections.map((section, i) =>
        i === index ? { ...section, question } : section
      )
    }));
  };

  const handleToneChange = (index: number, tone: string) => {
    setFormData(prev => ({
      ...prev,
      feedbackSections: prev.feedbackSections.map((section, i) =>
        i === index ? { ...section, tone } : section
      )
    }));
  };

  const constructPrompt = (formData: FormData, index: number) => {
    const { name, gender, position, feedbackSections, relationship, topics } = formData;
    const { question, initial, tone } = feedbackSections[index];
    const wordLimit = 'Recommened 200, Max 300 words.'
  
    return `
  You're a professional software engineering manager with over 15 years of experience in crafting performance reviews that effectively highlight an employee's strengths and areas for improvement. 
  You understand the importance of providing constructive feedback that fosters growth and motivation while maintaining professionalism and clarity.

  Your task is to write a performance review for my peer. Here are the peer's basic info:
  - Peer's Name: ${name}
  - Peer's Position:  ${position}
  - Peer's Gender:  ${gender}
  - Peer's Relationship with me:  ${relationship}

  The question asked is: 
  - Topic: ${topics}
  - ${question}

  And my initial feedback is:
  -${initial}
  
  Given a scale of 5 tonesfrom 'Extremely Negative', 'Negative', 'Neutral', 'Positive' to 'Extremely Positive'.
  My initial feedback has a tone of: ${tone}

  Refactor my initial feedback into a well-structured and professional performance review. 
  Here are the Rule to follow for the feedback.
  - Providing constructive feedback that maints professionalism and clarity, fosters growth.
  - Use the right tones/wordings based on my relationship to the peer, whether he/she is a manager/report/peer etc.
  - Focus mainly on the provided topics.
  - Strictly follow the provided word limit restriction.
  - The feedback should be based on solely based on user provided's initial feedbacks, do not hallucinate other facts/details.
  - Do not include any other information in the feeback, just type out the refactored feedback.
  - Focus mainly on topics: ${topics}
  - Strictly follow the word limit: ${wordLimit}

  Refactored feedback:
      `;
    };

  const handleRegenerate = async (index: number) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = constructPrompt(formData, index);
      console.log(prompt);
      const result = await model.generateContent([prompt]);
      const refinedFeedback = result.response.text();
  
      setFormData(prev => ({
        ...prev,
        feedbackSections: prev.feedbackSections.map((section, i) =>
          i === index ? { 
            ...section, 
            refined: refinedFeedback 
          } : section
        )
      }));
    } catch (error) {
      console.error('Error generating refined feedback:', error);
    }
  };

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      feedbackSections: [
        ...prev.feedbackSections,
        {
          question: '',
          initial: '',
          refined: null,
          tone: 'Neutral'
        }
      ]
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      feedbackSections: prev.feedbackSections.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
            placeholder="Enter colleague's name"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
            placeholder="Enter position/role"
          />
        </div>

        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
            Working Relationship
          </label>
          <input
            type="text"
            id="relationship"
            name="relationship"
            required
            value={formData.relationship}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
            placeholder="e.g., Direct report, Peer, Manager"
          />
        </div>
      </div>

      <TopicInput
        topics={formData.topics}
        onAddTopic={handleAddTopic}
        onRemoveTopic={handleRemoveTopic}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Feedback Questions</h3>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Question
          </button>
        </div>
        
        {formData.feedbackSections.map((section, index) => (
          <FeedbackSection
            key={index}
            questionNumber={index + 1}
            question={section.question.replace('{name}', formData.name || '{name}')}
            initialFeedback={section.initial}
            refinedFeedback={section.refined}
            tone={section.tone}
            onQuestionChange={(q) => handleQuestionChange(index, q)}
            onFeedbackChange={(feedback) => handleFeedbackChange(index, feedback)}
            onRegenerate={() => handleRegenerate(index)}
            onRemove={() => handleRemoveQuestion(index)}
            onToneChange={(tone) => handleToneChange(index, tone)}
            isLoading={isLoading}
            canRemove={formData.feedbackSections.length > 1}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Generate Professional Review <Send className="ml-2 h-4 w-4" />
          </span>
        )}
      </button>
    </form>
  );
}