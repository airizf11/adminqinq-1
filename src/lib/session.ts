// coteadmin/src/lib/session.ts
import { cookies } from "next/headers";

const ACCESS_COOKIE = process.env.JWT_COOKIE_NAME!; // 'cotebek_session'
const REFRESH_COOKIE = "cotebek_refresh";

export async function getStaffToken() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function setStaffTokens(
  accessToken: string,
  refreshToken: string,
) {
  const store = await cookies();

  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 menit — sama persis expiresIn di CoTEBek
  });

  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari — sama persis saveRefreshToken di CoTEBek
  });
}

export async function clearStaffTokens() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

export async function getCurrentUserEmail() {
  const token = await getStaffToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    return decoded.email ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUserName() {
  const token = await getStaffToken();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    return decoded.name ?? null;
  } catch {
    return null;
  }
}
