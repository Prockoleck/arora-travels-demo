/* Client-side image preparation for the admin console.

   Uploaded photos are resized/compressed in the browser so a publish
   request stays far below Vercel's request-body limit, then sent to
   /api/publish which commits them to public/img/uploads/ in the repo. */

export type PendingImage = {
  /** final file name, e.g. "innova-16x8k2p.jpg" (safe charset) */
  name: string;
  /** raw base64 (no data: prefix) — what the API accepts */
  data: string;
  /** local object URL for thumbnails in the console */
  previewUrl: string;
};

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function slugify(base: string): string {
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

/**
 * Read a File, scale it to maxWidth (default 1600) and encode as JPEG.
 * Returns the pending upload payload ready for publish.
 */
export async function prepareImage(
  file: File,
  opts: { maxWidth?: number; quality?: number } = {},
): Promise<PendingImage> {
  const { maxWidth = 1600, quality = 0.82 } = opts;
  if (!file.type.startsWith("image/")) throw new Error("Not an image file");

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
        "image/jpeg",
        quality,
      );
    });

    const data = await blobToBase64(blob);
    const ext = MIME_EXT[file.type] ?? "jpg";
    const name = `${slugify(file.name.replace(/\.[^.]+$/, ""))}-${Date.now().toString(36)}.${ext === "jpg" ? "jpg" : ext}`;

    return { name, data, previewUrl: URL.createObjectURL(blob) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const result = String(fr.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    fr.onerror = () => reject(new Error("Read failed"));
    fr.readAsDataURL(blob);
  });
}
