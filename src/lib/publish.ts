import type { SiteContent } from "./content";

/* Publish client for the admin console.

   The key below must match the PUBLISH_KEY env var on Vercel — it
   authenticates the console's publish request to /api/publish, which
   commits content + uploaded images to the repo (and therefore deploys).

   NOTE: this is a shared console key, not a secret vault — the API
   only ever writes public/content/site.json and public/img/uploads/*. */
export const PUBLISH_KEY = "arora-console-7f3c9a21e85b4d16";

export type PublishResult =
  | { ok: true; url: string; sha: string; files: number }
  | { ok: false; error: string; message: string };

export async function publishSite(
  content: SiteContent,
  images: { name: string; data: string }[],
): Promise<PublishResult> {
  let res: Response;
  try {
    res = await fetch("/api/publish", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-publish-key": PUBLISH_KEY,
      },
      body: JSON.stringify({ content, images }),
    });
  } catch {
    return { ok: false, error: "NETWORK", message: "Network error — could not reach the publish API." };
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  const body = (json || {}) as Record<string, unknown>;
  if (res.ok && body.ok) {
    return {
      ok: true,
      url: String(body.url || ""),
      sha: String(body.sha || ""),
      files: Number(body.files || 0),
    };
  }

  const error = String(body.error || `HTTP_${res.status}`);
  const message = String(body.message || body.error || "Publish failed.");
  return { ok: false, error, message };
}
