import { create } from "zustand";

interface UserState {
  username: string;
  totalQuizzes: number;
  avgScore: number;
  rank: number;
}

export const useUserStore = create<UserState>(() => ({
  username: "Jai Khanna",
  totalQuizzes: 12,
  avgScore: 85,
  rank: 3,
}));
