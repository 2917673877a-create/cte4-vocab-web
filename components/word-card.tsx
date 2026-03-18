import Link from "next/link";
import { Word } from "@/lib/types";

type WordCardProps = {
  word: Word;
};

export function WordCard({ word }: WordCardProps) {
  const detailHref = `/word?id=${encodeURIComponent(word.id)}`;

  return (
    <article className="rounded-3xl border border-stone-200 bg-white/90 p-5 shadow-soft transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href={detailHref} className="group inline-block">
            <h2 className="text-2xl font-semibold text-brand-900 transition-colors duration-200 group-hover:text-brand-700">
              {word.word}
            </h2>
          </Link>
          <p className="mt-1 text-sm text-stone-500">{word.phonetic}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Lv.{word.difficulty}
        </span>
      </div>
      <p className="mt-4 text-base text-stone-700">{word.meaning}</p>
      <p className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">{word.example}</p>
      <div className="mt-5 flex items-center justify-end">
        <Link
          className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          href={detailHref}
        >
          查看详情
        </Link>
      </div>
    </article>
  );
}
