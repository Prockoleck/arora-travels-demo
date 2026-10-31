/* ── Admin password ────────────────────────────────────────────
   The console is a static site, so the password is a light lock, not
   server-grade authentication: the hash lives in this browser's
   localStorage and the unlock flag in sessionStorage. Changing the
   password never leaves the device. */

export const AUTH_KEY = "arora_admin_auth";
export const PASSWORD_KEY = "arora_admin_password";
export const DEFAULT_PASSWORD = "12345678";
export const MIN_PASSWORD_LENGTH = 6;

const SALT = "arora-travels::";

/** SHA-256 where available; a small djb2 fallback for insecure origins
 *  (crypto.subtle only exists on HTTPS and localhost). */
async function digest(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(SALT + value);
  if (globalThis.crypto?.subtle) {
    const hash = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return (
      "sha256:" +
      Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
  }
  let h = 5381;
  for (const byte of bytes) h = ((h << 5) + h) ^ byte;
  return `djb2:${(h >>> 0).toString(16)}`;
}

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    /* private mode / quota — the password just won't persist */
  }
}

function safeRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Compare a typed password against the saved hash (or the factory one). */
export async function verifyPassword(input: string): Promise<boolean> {
  const stored = safeGet(localStorage, PASSWORD_KEY);
  if (!stored) return input === DEFAULT_PASSWORD;
  return (await digest(input)) === stored;
}

/** Current password is required; returns false when it doesn't match. */
export async function changePassword(current: string, next: string): Promise<boolean> {
  if (!(await verifyPassword(current))) return false;
  safeSet(localStorage, PASSWORD_KEY, await digest(next));
  return true;
}

export function isUnlocked(): boolean {
  return safeGet(sessionStorage, AUTH_KEY) === "1";
}

export function unlockConsole(): void {
  safeSet(sessionStorage, AUTH_KEY, "1");
}

export function lockConsole(): void {
  safeRemove(sessionStorage, AUTH_KEY);
}
