import { create } from "zustand";

interface QuizState {
  answers: { [key: string]: string }; //stores selected answers
  setAnswer: (questionId: string, answer: string) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  answers: {},
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
}));
