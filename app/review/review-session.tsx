"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getLearningRecord, loadLearningRecords, saveLearningRecord } from "@/lib/learning-records";
import { calculateNextReview, formatReviewDate } from "@/lib/sm2";
import { LearningRecord, ReviewResult, StoredLearningRecords, Word } from "@/lib/types";

type ReviewSessionProps = {
  words: Word[];
};

export function ReviewSession({ words }: ReviewSessionProps) {
  const { user } = useAuth();
  const [queue, setQueue] = useState<Word[]>([]);
  const [records, setRecords] = useState<StoredLearningRecords>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [status, setStatus] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function prepareQueue() {
      setIsReady(false);
      const now = new Date();
      const currentRecords = await loadLearningRecords(user?.uid);
      const dueWords = words.filter((word) => {
        const record = currentRecords[word.id];
        if (!record) {
          return true;
        }

        return new Date(record.nextReviewDate) <= now;
      });

      dueWords.sort((left, right) => {
        const leftRecord = currentRecords[left.id];
        const rightRecord = currentRecords[right.id];
        const leftTime = leftRecord ? new Date(leftRecord.nextReviewDate).getTime() : 0;
        const rightTime = rightRecord ? new Date(rightRecord.nextReviewDate).getTime() : 0;
        return leftTime - rightTime;
      });

      if (!mounted) {
        return;
      }

      setRecords(currentRecords);
      setQueue(dueWords);
      setCompletedCount(0);
      setStatus("");
      setIsReady(true);
    }

    void prepareQueue();

    return () => {
      mounted = false;
    };
  }, [user?.uid, words]);

  const currentWord = queue[0] ?? null;
  const currentRecord = useMemo<LearningRecord | null>(() => {
    if (!currentWord) {
      return null;
    }

    return records[currentWord.id] ?? null;
  }, [currentWord, records]);

  const handleReview = async (result: ReviewResult) => {
    if (!currentWord) {
      return;
    }

    setSubmitting(true);

    try {
      const baseRecord = currentRecord ?? (await getLearningRecord(currentWord.id, user?.uid));
      const updated = calculateNextReview(baseRecord, result);
      await saveLearningRecord(updated, user?.uid);

      setRecords((prev) => ({
        ...prev,
        [currentWord.id]: updated,
      }));
      setStatus(
        result === "remembered"
          ? `已记住 ${currentWord.word}，下次复习：${formatReviewDate(updated.nextReviewDate)}`
          : `已标记 ${currentWord.word} 为忘记，明天再次复习。`,
      );
      setCompletedCount((count) => count + 1);
      setQueue((prev) => prev.slice(1));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "更新复习记录失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-soft">
        <p className="text-stone-600">正在加载今天的复习列表...</p>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="space-y-6 rounded-[2rem] border border-stone-200 bg-white/90 p-8 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Today's Review</p>
          <h3 className="mt-3 text-3xl font-semibold text-brand-900">今天没有待复习单词</h3>
          <p className="mt-4 text-stone-600">
            {status || "当前没有到期的单词，可以先去详情页点击“记住了 / 没记住”积累学习记录。"}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {user ? `当前账号：${user.email}` : "当前为游客模式，登录后会自动同步学习记录。"}
          </p>
        </div>
        <Link
          className="inline-flex rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
          href="/"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-stone-200 bg-white/90 p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Today's Review</p>
          <h3 className="mt-3 text-3xl font-semibold text-brand-900">今天需要复习的单词</h3>
          <p className="mt-3 text-stone-600">
            按顺序逐个复习，点击“记住”或“忘记”后会自动切换到下一个。
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {user ? `当前账号：${user.email}` : "当前为游客模式，登录后会自动同步学习记录。"}
          </p>
        </div>
        <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
          进度 {completedCount + 1} / {completedCount + queue.length}
        </div>
      </div>

      <article className="rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-100">
          Review Card #{String(completedCount + 1).padStart(2, "0")}
        </p>
        <h4 className="mt-4 text-4xl font-semibold">{currentWord.word}</h4>
        <p className="mt-2 text-lg text-brand-100">{currentWord.phonetic}</p>
        <div className="mt-6 grid gap-4 rounded-3xl bg-white/10 p-5 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-100">释义</p>
            <p className="mt-2 text-lg">{currentWord.meaning}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-100">例句</p>
            <p className="mt-2 text-sm leading-7 text-brand-50">{currentWord.example}</p>
          </div>
        </div>
      </article>

      <div className="grid gap-3 rounded-3xl border border-stone-200 bg-stone-50 p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">interval</p>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            {currentRecord ? `${currentRecord.interval} 天` : "首次学习"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">easeFactor</p>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            {currentRecord ? currentRecord.easeFactor.toFixed(2) : "2.50"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">nextReviewDate</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {currentRecord ? formatReviewDate(currentRecord.nextReviewDate) : "现在开始"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={submitting}
          onClick={() => void handleReview("remembered")}
          type="button"
        >
          记住
        </button>
        <button
          className="rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-white hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={submitting}
          onClick={() => void handleReview("forgot")}
          type="button"
        >
          忘记
        </button>
        <Link
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 hover:border-brand-500 hover:text-brand-700"
          href={`/word/${currentWord.id}`}
        >
          查看详情
        </Link>
      </div>

      <p className="min-h-6 text-sm text-stone-600">{status}</p>
    </div>
  );
}
