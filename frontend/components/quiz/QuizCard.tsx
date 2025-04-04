
import React from "react";
import { Clock, BookOpen, Trash2, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizCardProps {
  quiz: {
    id: string;
    topic: string;
    difficulty: string;
    numQuestions: number;
    timeLimit: number;
    title?: string;
    createdAt?: string;
  };
  onStartQuiz: (id: string) => void;
  onDeleteQuiz: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz, onDeleteQuiz }) => {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Award className="w-5 h-5 text-quiz-beginner" />;
      case "Intermediate":
        return <Award className="w-5 h-5 text-quiz-intermediate" />;
      case "Advanced":
        return <Award className="w-5 h-5 text-quiz-advanced" />;
      default:
        return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "quiz-card-beginner bg-green-50";
      case "Intermediate":
        return "quiz-card-intermediate bg-amber-50";
      case "Advanced":
        return "quiz-card-advanced bg-red-50";
      default:
        return "";
    }
  };

  return (
    <Card className={`quiz-card ${getDifficultyColor(quiz.difficulty)} animate-scale-in`}>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-xl text-gray-800 line-clamp-2">
              {quiz.topic || quiz.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            {getDifficultyIcon(quiz.difficulty)}
            <span className="text-sm font-medium">{quiz.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm mb-6">
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm">
            <BookOpen className="w-4 h-4 text-quiz-purple" />
            <span>{quiz.numQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm">
            <Clock className="w-4 h-4 text-quiz-blue" />
            <span>{quiz.timeLimit} mins</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <Button 
            onClick={() => onStartQuiz(quiz.id)}
            className="col-span-4 bg-gradient-to-r from-quiz-purple to-quiz-blue text-white font-medium py-2 animated-gradient-button hover:shadow-lg"
          >
            Start Quiz
          </Button>
          <Button
            variant="outline"
            className="col-span-1 border-gray-200 hover:border-red-300 hover:bg-red-50"
            onClick={() => onDeleteQuiz(quiz.id)}
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
