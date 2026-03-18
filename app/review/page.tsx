import { ReviewSession } from "./review-session";
import { words } from "@/lib/words";

export default function ReviewPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-8 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-100">
          Review Mode
        </p>
        <h2 className="mt-3 text-4xl font-semibold">复习页面</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-100">
          这里会自动筛选今天需要复习的单词，并按顺序一张一张展示，适合像刷题一样连续复习。
        </p>
      </div>

      <ReviewSession words={words} />
    </section>
  );
}
