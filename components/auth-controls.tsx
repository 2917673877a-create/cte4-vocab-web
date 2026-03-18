"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export function AuthControls() {
  const { user, loading, logout, isConfigured } = useAuth();

  if (loading) {
    return (
      <span className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-400">
        加载中...
      </span>
    );
  }

  if (!isConfigured) {
    return (
      <Link
        className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
        href="/login"
      >
        配置 CloudBase
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
        href="/login"
      >
        登录 / 注册
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="max-w-48 truncate text-sm text-stone-600">{user.username || user.email || user.uid}</span>
      <button
        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-brand-500 hover:text-brand-700"
        onClick={() => void logout()}
        type="button"
      >
        退出登录
      </button>
    </div>
  );
}
