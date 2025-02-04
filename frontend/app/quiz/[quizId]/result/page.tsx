"use client";
import { useQuizStore } from "@/store/quizStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import ResultCard from "@/components/resultCard";

const correctAnswers = {
  "1": "4",
  "2": "Paris",
  "3": "Guido van Rossum",
}; // Example correct answers

export default function QuizResult() {
  const { answers } = useQuizStore();
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let correctCount = 0;
    Object.entries(correctAnswers).forEach(([questionId, correctAnswer]) => {
      if (answers[questionId] === correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    if (correctCount >= 2) setShowConfetti(true); // Celebrate if 2+ correct
  }, [answers]);

  return (
    <main className="max-w-lg mx-auto p-6 text-center bg-white rounded-lg shadow-md text-black">
      {showConfetti && <Confetti />}
      <h1 className="text-3xl font-bold mb-4">🎉 Quiz Completed!</h1>
      <p className="text-lg">Your Score: <span className="font-semibold text-blue-500">{score} / {Object.keys(correctAnswers).length}</span></p>
      
      <div className="mt-6">
        {Object.entries(answers).map(([questionId, answer]) => (
          <ResultCard
            key={questionId}
            questionId={questionId}
            userAnswer={answer}
            correctAnswer={correctAnswers[questionId]}
          />
        ))}
      </div>

      <div className="mt-6">
        <Link href="/quiz">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">Try Another Quiz</button>
        </Link>
      </div>
    </main>
  );
}
