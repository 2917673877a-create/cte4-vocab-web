"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

export function AuthForm() {
  const router = useRouter();
  const { login, register, isConfigured } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfigured) {
      setMessage("请先配置 CloudBase 环境变量后再继续。");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      if (mode === "login") {
        await login(username, password);
        setMessage("登录成功，正在跳转...");
        window.location.assign("/");
      } else {
        await register(username, password);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("操作失败，请稍后重试。");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {!isConfigured ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
          当前还没有检测到 CloudBase 配置。请先在 `.env.local` 或腾讯云托管环境中设置
          `NEXT_PUBLIC_TCB_*` 环境变量。
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === "login"
              ? "bg-brand-700 text-white"
              : "border border-stone-300 text-stone-700 hover:border-brand-500 hover:text-brand-700"
          }`}
          onClick={() => setMode("login")}
          type="button"
        >
          用户名登录
        </button>
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            mode === "register"
              ? "bg-brand-700 text-white"
              : "border border-stone-300 text-stone-700 hover:border-brand-500 hover:text-brand-700"
          }`}
          onClick={() => setMode("register")}
          type="button"
        >
          用户名注册
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="username">
            用户名
          </label>
          <input
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-brand-500"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="例如 cet4user"
            type="text"
            value={username}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700" htmlFor="password">
            密码
          </label>
          <input
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-brand-500"
            id="password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="至少 6 位"
            type="password"
            value={password}
          />
        </div>

        <button
          className="rounded-full bg-brand-700 px-6 py-3 text-sm font-medium text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "提交中..." : mode === "login" ? "立即登录" : "查看注册说明"}
        </button>
      </form>

      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-stone-600">
        <p>注册说明：</p>
        <p>CloudBase 当前已启用“用户名密码登录”，适合直接登录现有账号。</p>
        <p>如果你要新建用户，需要先在 CloudBase 控制台创建用户，或者改走邮箱/短信验证注册后再绑定用户名。</p>
      </div>

      <p className="min-h-6 text-sm text-stone-600">{message}</p>
    </div>
  );
}
