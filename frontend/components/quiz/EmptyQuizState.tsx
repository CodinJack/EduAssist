import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyQuizStateProps {
  onCreateQuiz: () => void;
}

const EmptyQuizState: React.FC<EmptyQuizStateProps> = ({ onCreateQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gradient-to-r from-quiz-purple to-quiz-blue text-white p-6 rounded-full mb-5">
        <PlusCircle className="w-12 h-12" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No quizzes yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Create your first quiz to start testing your knowledge or challenge others!
      </p>
      <Button 
        onClick={onCreateQuiz}
        className="bg-gradient-to-r from-quiz-purple to-quiz-blue text-white px-6 py-2 rounded-lg font-medium animated-gradient-button"
      >
        <PlusCircle className="w-5 h-5 mr-2" /> Create Your First Quiz
      </Button>
    </div>
  );
};

export default EmptyQuizState;
