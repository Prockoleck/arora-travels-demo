/* /api/publish — admin console publishing endpoint (Vercel function).

   Commits the site content snapshot + uploaded images to the repo in a
   single commit, which triggers a Vercel deploy (~60s to live).

   Writes are strictly limited to:
     - public/content/site.json
     - public/img/uploads/<safe-name>.jpg|png|webp

   Auth: x-publish-key header must equal the PUBLISH_KEY env var.
   Requires env: GH_TOKEN (repo scope), optional GH_REPO / GH_BRANCH. */

const API = "https://api.github.com";
const REPO = process.env.GH_REPO || "Prockoleck/arora-travels-demo";
const BRANCH = process.env.GH_BRANCH || "main";

export const maxDuration = 30;

const NAME_RE = /^[a-z0-9][a-z0-9._-]{0,80}\.(jpg|jpeg|png|webp)$/i;
const B64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const MAX_CONTENT_BYTES = 400_000; // site.json payload cap
const MAX_IMAGE_BYTES = 2_500_000; // per image, decoded
const MAX_IMAGES = 8;

async function gh(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    method: opts.method || "GET",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${process.env.GH_TOKEN}`,
      "user-agent": "arora-travels-admin",
      "content-type": "application/json",
    },
    body: opts.body,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(json?.message || `GitHub ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

function fail(res, status, error, message) {
  res.status(status).json({ ok: false, error, message });
}

function validate(content, images) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return "content must be an object";
  }
  if (!content.business || typeof content.business !== "object") {
    return "content.business is missing";
  }
  if (!Array.isArray(content.fleet)) {
    return "content.fleet must be an array";
  }
  const size = Buffer.byteLength(JSON.stringify(content), "utf8");
  if (size > MAX_CONTENT_BYTES) {
    return `content too large (${size} bytes, max ${MAX_CONTENT_BYTES})`;
  }

  if (images !== undefined) {
    if (!Array.isArray(images)) return "images must be an array";
    if (images.length > MAX_IMAGES) return `too many images (max ${MAX_IMAGES})`;
    let total = 0;
    for (const img of images) {
      if (!img || typeof img.name !== "string" || !NAME_RE.test(img.name)) {
        return `invalid image name: ${img && img.name}`;
      }
      if (typeof img.data !== "string" || img.data.length === 0 || !B64_RE.test(img.data)) {
        return `invalid image data for ${img.name}`;
      }
      const bytes = Math.floor((img.data.length * 3) / 4);
      total += bytes;
      if (bytes > MAX_IMAGE_BYTES) return `image ${img.name} too large`;
    }
    if (total > 4_000_000) return "total image payload too large (max 4 MB)";
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return fail(res, 405, "METHOD", "Use POST.");
  }

  const expected = process.env.PUBLISH_KEY;
  if (!expected || !process.env.GH_TOKEN) {
    return fail(
      res,
      501,
      "NOT_CONFIGURED",
      "Publishing is not configured: set PUBLISH_KEY and GH_TOKEN in the project's environment variables.",
    );
  }
  const given = req.headers["x-publish-key"];
  if (given !== expected) {
    return fail(res, 401, "UNAUTHORIZED", "Wrong publish key.");
  }

  const body = req.body || {};
  const content = body.content;
  const images = Array.isArray(body.images) ? body.images : [];

  const problem = validate(content, images);
  if (problem) return fail(res, 400, "INVALID", problem);

  try {
    const files = [];

    // 1) blobs for uploaded images
    for (const img of images) {
      const blob = await gh(`/repos/${REPO}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: img.data, encoding: "base64" }),
      });
      files.push({ path: `public/img/uploads/${img.name}`, sha: blob.sha });
    }

    // 2) blob for the content snapshot
    const jsonB64 = Buffer.from(JSON.stringify(content, null, 2), "utf8").toString("base64");
    const jsonBlob = await gh(`/repos/${REPO}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: jsonB64, encoding: "base64" }),
    });
    files.push({ path: "public/content/site.json", sha: jsonBlob.sha });

    // 3) head commit + tree
    const ref = await gh(`/repos/${REPO}/git/ref/heads/${BRANCH}`);
    const headSha = ref.object.sha;
    const headCommit = await gh(`/repos/${REPO}/git/commits/${headSha}`);

    // 4) tree reusing existing blobs
    const tree = await gh(`/repos/${REPO}/git/trees`, {
      method: "POST",
      body: JSON.stringify({
        base_tree: headCommit.tree.sha,
        tree: files.map((f) => ({ path: f.path, mode: "100644", type: "blob", sha: f.sha })),
      }),
    });

    // 5) commit + move the branch
    const noun = files.length === 1 ? "file" : "files";
    const newCommit = await gh(`/repos/${REPO}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message: `content: publish from admin console (${files.length} ${noun})`,
        tree: tree.sha,
        parents: [headSha],
      }),
    });

    await gh(`/repos/${REPO}/git/refs/heads/${BRANCH}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: newCommit.sha }),
    });

    return res.status(200).json({
      ok: true,
      sha: newCommit.sha,
      url: newCommit.html_url,
      files: files.length,
    });
  } catch (err) {
    const status = err.status === 401 || err.status === 403 ? 502 : 502;
    return fail(res, status, "GITHUB", `GitHub: ${err.message}`);
  }
}
