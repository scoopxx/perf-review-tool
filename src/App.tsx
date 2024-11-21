import React from 'react';
import { FileText } from 'lucide-react';
import ReviewForm from './components/ReviewForm';

function App() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    // Simulate API call delay
    console.log('Form data submitted:', formData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Peer Feedback Review Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your informal feedback into professionally crafted peer reviews.
            Simply fill in the details below and let our tool help you generate a
            well-structured review.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <ReviewForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
