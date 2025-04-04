import React, { useState } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  newQuiz: {
    topic: string;
    difficulty: string;
    questionCount: number;
  };
  setNewQuiz: React.Dispatch<
    React.SetStateAction<{
      topic: string;
      difficulty: string;
      questionCount: number;
    }>
  >;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  newQuiz,
  setNewQuiz,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-quiz-purple to-quiz-blue p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Create a New Quiz</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Quiz Topic
            </label>
            <Input
              id="topic"
              placeholder="e.g., JavaScript Fundamentals"
              value={newQuiz.topic}
              onChange={(e) => setNewQuiz({ ...newQuiz, topic: e.target.value })}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <Select 
              value={newQuiz.difficulty} 
              onValueChange={(val) => setNewQuiz({ ...newQuiz, difficulty: val })}
            >
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700">
              Number of Questions
            </label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max="50"
              value={newQuiz.questionCount}
              onChange={(e) => setNewQuiz({ ...newQuiz, questionCount: Number(e.target.value) })}
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500">Between 1 and 50 questions</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              The quiz time limit will be calculated based on the number of questions and difficulty level.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-quiz-purple to-quiz-blue hover:shadow-md animated-gradient-button"
            >
              Create Quiz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;
