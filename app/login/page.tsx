import { AuthForm } from "./auth-form";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white/90 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Account</p>
        <h2 className="mt-3 text-4xl font-semibold text-brand-900">登录或注册</h2>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          现在改为使用 CloudBase 用户名密码登录。登录后，单词学习记录会跟当前账号绑定，更适合在中国大陆环境中使用。
        </p>

        <AuthForm />
      </div>
    </section>
  );
}
