import { Trash2 } from "lucide-react";
import type { AboutContent, BandContent, HeroContent, WhyContent } from "../../lib/content";
import {
  Btn,
  Card,
  ImagePicker,
  SectionTitle,
  TextField,
  micro,
  type DraftProps,
  type MediaApi,
} from "./ui";

/* ── Media — the site-wide image slots + pending upload queue ── */

type Slot = {
  title: string;
  accent?: string;
  desc: string;
  path: string;
  alt?: string;
  caption?: string;
  onPath: (p: string) => void;
  onAlt?: (v: string) => void;
  onCaption?: (v: string) => void;
  onFile: (f: File) => Promise<void>;
  media: MediaApi;
  maxWidth?: number;
  contain?: boolean;
};

function MediaCard({
  title,
  accent,
  desc,
  path,
  alt,
  caption,
  onPath,
  onAlt,
  onCaption,
  onFile,
  media,
  maxWidth,
  contain,
}: Slot) {
  return (
    <Card>
      <SectionTitle title={title} accent={accent} desc={desc} />
      <ImagePicker
        label="Image"
        path={path}
        pending={media.pending}
        onFile={onFile}
        contain={contain}
        previewClass={contain ? "h-24 w-40" : "h-32 w-48"}
        hint={maxWidth ? `Resized to ${maxWidth}px wide before upload.` : undefined}
      />
      {(onAlt || onCaption) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {onAlt && (
            <TextField
              label="Alt text"
              value={alt ?? ""}
              onChange={onAlt}
              hint="Describe the photo for screen readers & search."
            />
          )}
          {onCaption && (
            <TextField
              label="Caption"
              value={caption ?? ""}
              onChange={onCaption}
              placeholder="Harmandir Sahib · Amritsar at dusk"
            />
          )}
        </div>
      )}
    </Card>
  );
}

export default function MediaEditor({ draft, update, media }: DraftProps & { media: MediaApi }) {
  /* Patch builders read the LATEST draft — image uploads resolve asynchronously. */
  const setHero = (fn: (h: HeroContent) => Partial<HeroContent>) =>
    update((prev) => ({ hero: { ...prev.hero, ...fn(prev.hero) } }));
  const setBand = (fn: (b: BandContent) => Partial<BandContent>) =>
    update((prev) => ({ band: { ...prev.band, ...fn(prev.band) } }));
  const setAbout = (fn: (a: AboutContent) => Partial<AboutContent>) =>
    update((prev) => ({ about: { ...prev.about, ...fn(prev.about) } }));
  const setWhy = (fn: (w: WhyContent) => Partial<WhyContent>) =>
    update((prev) => ({ why: { ...prev.why, ...fn(prev.why) } }));
  const setLogo = (fn: (l: { src: string }) => Partial<{ src: string }>) =>
    update((prev) => ({ logo: { ...prev.logo, ...fn(prev.logo) } }));

  const upload = (apply: (path: string) => void, maxWidth?: number) => (f: File) =>
    media.upload(f, { maxWidth, apply });

  const removePending = (name: string) => {
    const inUse = JSON.stringify(draft).includes(`/img/uploads/${name}`);
    const msg = `"${name}" is still used by the draft. Removing it leaves that slot pointing at a missing file — remove anyway?`;
    if (inUse && !confirm(msg)) return;
    media.remove(name);
  };

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Photos &"
        accent="assets"
        desc="Every image on the site lives in one of these slots. Uploads are staged here and only go live when you publish."
      />

      <MediaCard
        title="Hero background —"
        accent="Golden Temple"
        desc="Full-screen opening image behind the headline."
        path={draft.hero.img}
        alt={draft.hero.imgAlt}
        caption={draft.hero.caption}
        media={media}
        onPath={(p) => setHero(() => ({ img: p }))}
        onAlt={(v) => setHero(() => ({ imgAlt: v }))}
        onCaption={(v) => setHero(() => ({ caption: v }))}
        onFile={upload((p) => setHero(() => ({ img: p })))}
      />

      <MediaCard
        title="Wagah band"
        accent="background"
        desc="The wide “Explore Amritsar” band between the hero and the fleet."
        path={draft.band.img}
        alt={draft.band.imgAlt}
        media={media}
        onPath={(p) => setBand(() => ({ img: p }))}
        onAlt={(v) => setBand(() => ({ imgAlt: v }))}
        onFile={upload((p) => setBand(() => ({ img: p })))}
      />

      <MediaCard
        title="About"
        accent="photo"
        desc="Heritage image in the “Since 1997” story section."
        path={draft.about.img}
        alt={draft.about.imgAlt}
        caption={draft.about.caption}
        media={media}
        onPath={(p) => setAbout(() => ({ img: p }))}
        onAlt={(v) => setAbout(() => ({ imgAlt: v }))}
        onCaption={(v) => setAbout(() => ({ caption: v }))}
        onFile={upload((p) => setAbout(() => ({ img: p })))}
      />

      <MediaCard
        title="Chauffeur"
        accent="photo"
        desc="Shown beside the “why choose us” reasons."
        path={draft.why.img}
        alt={draft.why.imgAlt}
        caption={draft.why.caption}
        media={media}
        onPath={(p) => setWhy(() => ({ img: p }))}
        onAlt={(v) => setWhy(() => ({ imgAlt: v }))}
        onCaption={(v) => setWhy(() => ({ caption: v }))}
        onFile={upload((p) => setWhy(() => ({ img: p })))}
      />

      <MediaCard
        title="Site"
        accent="logo"
        desc="Header + footer mark. Square-ish images work best."
        path={draft.logo.src}
        media={media}
        maxWidth={1200}
        contain
        onPath={(p) => setLogo(() => ({ src: p }))}
        onFile={upload((p) => setLogo(() => ({ src: p })), 1200)}
      />

      <Card>
        <SectionTitle
          title="Pending"
          accent="uploads"
          desc="Queued on this device — they are committed to the repo the next time you publish."
        />
        {media.pending.length === 0 ? (
          <p className={micro}>Nothing queued — 8 slots free.</p>
        ) : (
          <ul className="space-y-2">
            {media.pending.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-3 rounded-lg border border-paper-2 px-3 py-2"
              >
                <img
                  src={p.previewUrl}
                  alt=""
                  className="h-10 w-14 shrink-0 rounded-md border border-paper-2 object-cover"
                />
                <span className="min-w-0 flex-1 break-all font-mono text-[11px] text-ink">
                  {p.name}
                </span>
                <Btn
                  kind="danger"
                  onClick={() => removePending(p.name)}
                  aria-label={`Remove ${p.name}`}
                >
                  <Trash2 size={12} /> Remove
                </Btn>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11.5px] text-steel">Limit: 8 pending images per publish.</p>
      </Card>
    </div>
  );
}
