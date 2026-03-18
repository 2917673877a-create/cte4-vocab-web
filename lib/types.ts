export type Word = {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  difficulty: number;
  audioUrl?: string;
};

export type ReviewResult = "remembered" | "forgot";

export type LearningRecord = {
  wordId: string;
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
  repetitions: number;
  lastReviewedAt: string;
};

export type StoredLearningRecords = Record<string, LearningRecord>;
