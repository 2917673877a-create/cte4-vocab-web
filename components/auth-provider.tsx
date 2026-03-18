"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, getAuthUser, isCloudbaseConfigured, type CloudbaseAuthUser } from "@/lib/cloudbase";
import { syncLocalRecordsToCloud } from "@/lib/learning-records";

type AuthContextValue = {
  user: CloudbaseAuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CloudbaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isCloudbaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const syncUser = async () => {
      try {
        const nextUser = await getAuthUser();

        if (!mounted) {
          return;
        }

        setUser(nextUser);

        if (nextUser?.uid) {
          await syncLocalRecordsToCloud(nextUser.uid);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
        }
        console.error("CloudBase auth sync failed:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void syncUser();
    const subscription = auth.onAuthStateChange(() => {
      void syncUser();
    });

    return () => {
      mounted = false;
      subscription?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured: isCloudbaseConfigured,
      async login(username, password) {
        if (!auth) {
          throw new Error("CloudBase 未配置。");
        }

        await auth.signInWithPassword({ username, password });
      },
      async register(username) {
        if (!auth) {
          throw new Error("CloudBase 未配置。");
        }

        throw new Error(
          `当前 CloudBase 控制台已启用“用户名密码登录”，但不支持在前端直接用用户名完成自助注册。请先在 CloudBase 控制台的用户管理中创建用户，或改用邮箱/短信注册后再绑定用户名。当前输入的用户名：${username}`,
        );
      },
      async logout() {
        if (!auth) {
          return;
        }

        await auth.signOut();
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth 必须在 AuthProvider 中使用。");
  }

  return context;
}
