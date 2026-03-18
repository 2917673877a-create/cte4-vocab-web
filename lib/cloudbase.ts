import cloudbase from "@cloudbase/js-sdk";

const cloudbaseConfig = {
  env: process.env.NEXT_PUBLIC_TCB_ENV_ID,
  region: process.env.NEXT_PUBLIC_TCB_REGION || "ap-shanghai",
  clientId: process.env.NEXT_PUBLIC_TCB_CLIENT_ID,
  accessKey: process.env.NEXT_PUBLIC_TCB_ACCESS_KEY,
};

export const isCloudbaseConfigured = Boolean(cloudbaseConfig.env);

const app = isCloudbaseConfigured
  ? cloudbase.init({
      env: cloudbaseConfig.env!,
      region: cloudbaseConfig.region,
      clientId: cloudbaseConfig.clientId,
      accessKey: cloudbaseConfig.accessKey,
    })
  : null;

export const cloudbaseApp = app;
export const auth = app ? app.auth({ persistence: "local" }) : null;
export const db = app ? app.database() : null;

export type CloudbaseAuthUser = {
  uid: string;
  email: string | null;
  username: string | null;
};

export async function getAuthUser(): Promise<CloudbaseAuthUser | null> {
  if (!auth) {
    return null;
  }

  const user = await auth.getCurrentUser();
  if (!user?.uid) {
    return null;
  }

  return {
    uid: user.uid,
    email: typeof (user as { email?: unknown }).email === "string" ? (user as { email?: string }).email ?? null : null,
    username:
      typeof (user as { username?: unknown }).username === "string"
        ? (user as { username?: string }).username ?? null
        : null,
  };
}
