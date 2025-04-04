
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QuizSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const QuizSearchBar: React.FC<QuizSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        placeholder="Search by quiz topic..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10 py-2 border-0 bg-white shadow-sm rounded-xl focus-visible:ring-quiz-purple"
      />
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setSearchQuery('')}
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default QuizSearchBar;
