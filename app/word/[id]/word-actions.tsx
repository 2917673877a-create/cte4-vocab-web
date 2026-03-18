"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getLearningRecord, saveLearningRecord } from "@/lib/learning-records";
import { calculateNextReview, formatReviewDate } from "@/lib/sm2";
import { LearningRecord, ReviewResult, Word } from "@/lib/types";

type WordActionsProps = {
  word: Word;
};

export function WordActions({ word }: WordActionsProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [record, setRecord] = useState<LearningRecord | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRecord() {
      try {
        setLoadingRecord(true);
        const nextRecord = await getLearningRecord(word.id, user?.uid);

        if (mounted) {
          setRecord(nextRecord);
        }
      } catch (error) {
        if (mounted) {
          setRecord(null);
          setStatus(error instanceof Error ? error.message : "加载学习记录失败，请稍后重试。");
        }
        console.error("Failed to load learning record:", error);
      } finally {
        if (mounted) {
          setLoadingRecord(false);
        }
      }
    }

    void loadRecord();

    return () => {
      mounted = false;
    };
  }, [user?.uid, word.id]);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("当前浏览器不支持发音功能。");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    setStatus(`正在播放 ${word.word} 的发音`);
  };

  const handleReview = async (result: ReviewResult) => {
    setSaving(true);

    try {
      const current = record ?? (await getLearningRecord(word.id, user?.uid));
      const updated = calculateNextReview(current, result);
      await saveLearningRecord(updated, user?.uid);
      setRecord(updated);
      setStatus(
        result === "remembered"
          ? `已标记“${word.word}”为记住了，下次复习：${formatReviewDate(updated.nextReviewDate)}`
          : `已标记“${word.word}”为没记住，明天再次复习。`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "保存学习记录失败，请稍后重试。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-stone-200 bg-stone-50 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
        学习操作
      </h3>
      <p className="mt-2 text-sm text-stone-500">
        {user ? `当前账号：${user.username || user.email || user.uid}` : "当前为游客模式，登录后会自动同步学习记录。"}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
          onClick={handleSpeak}
          type="button"
        >
          播放发音
        </button>
        <button
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={saving || loadingRecord}
          onClick={() => void handleReview("remembered")}
          type="button"
        >
          记住了
        </button>
        <button
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={saving || loadingRecord}
          onClick={() => void handleReview("forgot")}
          type="button"
        >
          没记住
        </button>
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">interval</p>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            {loadingRecord ? "加载中..." : record ? `${record.interval} 天` : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">easeFactor</p>
          <p className="mt-2 text-lg font-semibold text-stone-900">
            {loadingRecord ? "加载中..." : record ? record.easeFactor.toFixed(2) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">nextReviewDate</p>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {loadingRecord ? "加载中..." : record ? formatReviewDate(record.nextReviewDate) : "-"}
          </p>
        </div>
      </div>

      <p className="mt-4 min-h-6 text-sm text-stone-600">{status}</p>
    </div>
  );
}
