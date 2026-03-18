import { LearningRecord, ReviewResult } from "@/lib/types";

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function createInitialLearningRecord(wordId: string): LearningRecord {
  const now = new Date();

  return {
    wordId,
    interval: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    nextReviewDate: now.toISOString(),
    repetitions: 0,
    lastReviewedAt: now.toISOString(),
  };
}

export function calculateNextReview(
  record: LearningRecord,
  result: ReviewResult,
  reviewDate = new Date(),
): LearningRecord {
  const quality = result === "remembered" ? 5 : 2;
  const updatedEaseFactor = Math.max(
    MIN_EASE_FACTOR,
    record.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  if (quality < 3) {
    return {
      ...record,
      interval: 1,
      easeFactor: updatedEaseFactor,
      repetitions: 0,
      lastReviewedAt: reviewDate.toISOString(),
      nextReviewDate: new Date(reviewDate.getTime() + MS_PER_DAY).toISOString(),
    };
  }

  const repetitions = record.repetitions + 1;

  let interval = 1;
  if (repetitions === 1) {
    interval = 1;
  } else if (repetitions === 2) {
    interval = 6;
  } else {
    interval = Math.max(1, Math.round(record.interval * updatedEaseFactor));
  }

  return {
    ...record,
    interval,
    easeFactor: updatedEaseFactor,
    repetitions,
    lastReviewedAt: reviewDate.toISOString(),
    nextReviewDate: new Date(reviewDate.getTime() + interval * MS_PER_DAY).toISOString(),
  };
}

export function formatReviewDate(dateString: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}
