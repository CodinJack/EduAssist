"use client";

import React from "react";

interface ResultCardProps {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
  }
  
export default function ResultCard({ questionId, userAnswer, correctAnswer }: ResultCardProps) {
    const isCorrect = userAnswer === correctAnswer;
  
    return (
      <div className={`p-4 my-3 border rounded-lg shadow-md ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
        <h2 className="text-lg font-semibold">Question {questionId}</h2>
        <p>Your Answer: <span className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>{userAnswer}</span></p>
        {!isCorrect && <p>✅ Correct Answer: <span className="font-semibold text-blue-600">{correctAnswer}</span></p>}
      </div>
    );
  }
  