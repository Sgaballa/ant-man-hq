import type { ApiResponse } from "./types";

export async function espn<T>(
  url: string,
  init: { revalidate?: number } = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      next: init.revalidate !== undefined ? { revalidate: init.revalidate } : undefined,
    });

    if (!res.ok) {
      return { ok: false, error: `ESPN returned ${res.status}`, data: null };
    }

    const json = (await res.json()) as T;
    return { ok: true, data: json };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message, data: null };
  }
}
