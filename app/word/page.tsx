import Link from "next/link";
import { notFound } from "next/navigation";
import { getWordById } from "@/lib/words";
import { WordActionsShell } from "./word-actions-shell";

type WordPageProps = {
  searchParams?: Promise<{
    id?: string;
  }>;
};

export default async function WordPage({ searchParams }: WordPageProps) {
  const params = searchParams ? await searchParams : {};
  const id = typeof params.id === "string" ? params.id : "";

  if (!id) {
    notFound();
  }

  const word = getWordById(id);

  if (!word) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Word Detail</p>
        <h2 className="mt-3 text-4xl font-semibold text-brand-900">{word.word}</h2>
        <p className="mt-3 text-lg text-stone-500">{word.phonetic}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-stone-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">释义</h3>
            <p className="mt-3 text-lg text-stone-800">{word.meaning}</p>
          </div>

          <div className="rounded-3xl bg-brand-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">发音提示</h3>
            <p className="mt-3 text-base leading-7 text-brand-900">
              点击下方“播放发音”按钮，使用浏览器内置的 speechSynthesis API 朗读当前单词。
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-stone-200 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">例句</h3>
          <p className="mt-3 text-base leading-7 text-stone-700">{word.example}</p>
        </div>

        <WordActionsShell word={word} />

        <div className="mt-8 flex gap-3">
          <Link
            className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
            href="/"
          >
            返回首页
          </Link>
          <Link
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:border-brand-500 hover:text-brand-700"
            href="/review"
          >
            去复习页
          </Link>
        </div>
      </div>
    </section>
  );
}
