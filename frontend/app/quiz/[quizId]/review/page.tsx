'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizReview = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}/review`);
        const data = await response.json();
        setQuizData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    fetchQuizReview();
  }, [quizId]);

  if (loading) return <div className="text-center mt-8">Loading review...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Quiz Review</h1>
      {quizData?.questions?.map((q, idx) => {
        const isCorrect = q.selectedAnswer === q.correctAnswer;

        return (
          <div key={idx} className="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h2 className="font-semibold mb-4">{idx + 1}. {q.question}</h2>
            <ul>
              {q.options.map((opt, i) => {
                let style = "border px-4 py-2 rounded mb-2";

                if (opt === q.selectedAnswer) {
                  style += isCorrect
                    ? " bg-green-200 border-green-600"
                    : " bg-red-200 border-red-600";
                } else {
                  style += " border-gray-300";
                }

                return (
                  <li key={i} className={style}>
                    {opt}
                  </li>
                );
              })}
            </ul>

            {!isCorrect && (
              <div className="mt-4 text-sm text-green-700">
                ✅ Correct answer: <span className="font-semibold">{q.correctAnswer}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewPage;
