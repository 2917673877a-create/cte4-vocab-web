import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-stone-200 bg-white/90 p-8 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-stone-400">404</p>
      <h2 className="mt-3 text-3xl font-semibold text-brand-900">单词不存在</h2>
      <p className="mt-4 text-stone-600">请返回首页重新选择一个有效的单词条目。</p>
      <Link
        className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
        href="/"
      >
        返回首页
      </Link>
    </section>
  );
}
