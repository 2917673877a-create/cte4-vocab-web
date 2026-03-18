import Link from "next/link";
import { WordCard } from "@/components/word-card";
import { words } from "@/lib/words";

const PAGE_SIZE = 20;

type HomePageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : {};
  const requestedPage = Number(params.page) || 1;
  const totalPages = Math.max(1, Math.ceil(words.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedWords = words.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-brand-900 px-6 py-8 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-100">
          Word List
        </p>
        <h2 className="mt-3 text-4xl font-semibold">首页</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-100">
          这里展示 CET-4 单词列表。点击任意单词可进入详情页，首页支持每页 20 个单词的分页浏览。
        </p>
        <p className="mt-4 text-sm text-brand-100">
          第 {currentPage} / {totalPages} 页，共 {words.length} 个单词
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paginatedWords.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>

      <nav className="flex items-center justify-center gap-3">
        <PaginationLink
          disabled={currentPage <= 1}
          href={`/?page=${currentPage - 1}`}
          label="上一页"
        />

        <span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
          {currentPage} / {totalPages}
        </span>

        <PaginationLink
          disabled={currentPage >= totalPages}
          href={`/?page=${currentPage + 1}`}
          label="下一页"
        />
      </nav>
    </section>
  );
}

function PaginationLink({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm text-stone-400">
        {label}
      </span>
    );
  }

  return (
    <Link
      className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:border-brand-500 hover:text-brand-900"
      href={href}
    >
      {label}
    </Link>
  );
}
