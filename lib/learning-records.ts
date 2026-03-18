import { db } from "@/lib/cloudbase";
import { createInitialLearningRecord } from "@/lib/sm2";
import { LearningRecord, StoredLearningRecords } from "@/lib/types";

const COLLECTION_NAME = "learning_records";
export const STORAGE_KEY = "cte4-learning-records";

function loadLocalLearningRecords(): StoredLearningRecords {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as StoredLearningRecords;
  } catch {
    return {};
  }
}

function saveLocalLearningRecords(records: StoredLearningRecords) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function buildRecordDocumentId(userId: string, wordId: string) {
  return `${userId}__${wordId}`;
}

async function loadCloudLearningRecords(userId: string): Promise<StoredLearningRecords> {
  if (!db) {
    return {};
  }

  const result = await db.collection(COLLECTION_NAME).where({ userId }).limit(2000).get();
  const list = Array.isArray(result.data) ? result.data : [];
  const records: StoredLearningRecords = {};

  for (const item of list as Array<Record<string, unknown>>) {
    const wordId = typeof item.wordId === "string" ? item.wordId : "";
    if (!wordId) {
      continue;
    }

    records[wordId] = {
      wordId,
      interval: Number(item.interval ?? 0),
      easeFactor: Number(item.easeFactor ?? 2.5),
      nextReviewDate: String(item.nextReviewDate ?? new Date().toISOString()),
      repetitions: Number(item.repetitions ?? 0),
      lastReviewedAt: String(item.lastReviewedAt ?? new Date().toISOString()),
    };
  }

  return records;
}

async function saveCloudLearningRecord(userId: string, record: LearningRecord) {
  if (!db) {
    return;
  }

  await db.collection(COLLECTION_NAME).doc(buildRecordDocumentId(userId, record.wordId)).set({
    userId,
    ...record,
  });
}

function pickLatestRecord(left: LearningRecord, right: LearningRecord) {
  return new Date(left.lastReviewedAt).getTime() >= new Date(right.lastReviewedAt).getTime()
    ? left
    : right;
}

export async function loadLearningRecords(userId?: string | null): Promise<StoredLearningRecords> {
  if (!userId || !db) {
    return loadLocalLearningRecords();
  }

  const records = await loadCloudLearningRecords(userId);
  saveLocalLearningRecords(records);
  return records;
}

export async function getLearningRecord(
  wordId: string,
  userId?: string | null,
): Promise<LearningRecord> {
  const records = await loadLearningRecords(userId);
  return records[wordId] ?? createInitialLearningRecord(wordId);
}

export async function saveLearningRecord(
  record: LearningRecord,
  userId?: string | null,
): Promise<void> {
  const localRecords = loadLocalLearningRecords();
  localRecords[record.wordId] = record;
  saveLocalLearningRecords(localRecords);

  if (!userId || !db) {
    return;
  }

  await saveCloudLearningRecord(userId, record);
}

export async function syncLocalRecordsToCloud(userId: string): Promise<void> {
  if (!db) {
    return;
  }

  const localRecords = loadLocalLearningRecords();
  const localRecordList = Object.values(localRecords);
  const cloudRecords = await loadCloudLearningRecords(userId);
  const mergedRecords: StoredLearningRecords = { ...cloudRecords };

  for (const record of localRecordList) {
    const current = mergedRecords[record.wordId];
    mergedRecords[record.wordId] = current ? pickLatestRecord(current, record) : record;
  }

  for (const record of Object.values(mergedRecords)) {
    await saveCloudLearningRecord(userId, record);
  }

  saveLocalLearningRecords(mergedRecords);
}
