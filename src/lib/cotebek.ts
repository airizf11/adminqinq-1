// adminqinq/src/lib/cotebek.ts
import { getStaffToken } from "./session";

const BASE_URL = process.env.COTEBEK_API_URL!;
const API_KEY = process.env.COTEBEK_API_KEY!;

type FetchOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  requireAuth?: boolean;
};

export async function cotebek<T = unknown>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  const { method = "GET", body, requireAuth = true } = opts;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  };

  if (requireAuth) {
    const token = await getStaffToken();
    if (!token) throw new Error("UNAUTHENTICATED");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message ?? `CoTEBek error ${res.status}`);
  }

  return res.json();
}
