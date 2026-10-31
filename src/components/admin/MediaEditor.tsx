import { Plus, Trash2 } from "lucide-react";
import type {
  AboutContent,
  BandContent,
  HeroContent,
  HeroSlide,
  WhyContent,
} from "../../lib/content";
import {
  Btn,
  Card,
  IconBtn,
  ImagePicker,
  MoveBtns,
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

/** Hero slideshow manager — the framed photo beside the headline. */
function HeroSlidesCard({ draft, update, media }: DraftProps & { media: MediaApi }) {
  const slides = draft.hero.slides;

  const setHero = (fn: (h: HeroContent) => Partial<HeroContent>) =>
    update((prev) => ({ hero: { ...prev.hero, ...fn(prev.hero) } }));

  const setSlides = (next: HeroSlide[]) => setHero(() => ({ slides: next }));

  const patchSlide = (index: number, patch: Partial<HeroSlide>) =>
    setHero((h) => ({
      slides: h.slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
    }));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= slides.length) return;
    const next = [...slides];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setSlides(next);
  };

  const addSlide = () =>
    setSlides([
      ...slides,
      {
        src: slides[0]?.src ?? "/dest/golden-temple.jpg",
        alt: "",
        caption: "",
      },
    ]);

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    if (!confirm(`Remove slide ${index + 1}?`)) return;
    setSlides(slides.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <SectionTitle
        title="Hero"
        accent="slideshow"
        desc="The framed print beside the opening headline. Each slide advances automatically; the photo drifts slowly while it is on screen."
        right={
          <Btn kind="primary" onClick={addSlide}>
            <Plus size={14} /> Add slide
          </Btn>
        }
      />

      <div className="max-w-xs">
        <TextField
          label="Seconds per slide"
          inputMode="numeric"
          value={String(draft.hero.slideSeconds)}
          onChange={(v) =>
            setHero(() => ({
              slideSeconds: Math.max(0, Math.min(300, Number(v.replace(/[^\d]/g, "")) || 0)),
            }))
          }
          hint="2–60 seconds (default 7). One full loop is slides × seconds."
        />
      </div>

      <div className="mt-4 space-y-4">
        {slides.map((slide, i) => (
          <div key={i} className="rounded-xl border border-paper-2 bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-paper-2 pb-3">
              <div className="min-w-0">
                <span className={micro}>Slide {String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 truncate text-[13px] font-bold text-navy">
                  {slide.caption || slide.alt || "Untitled slide"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <MoveBtns
                  onUp={() => move(i, i - 1)}
                  onDown={() => move(i, i + 1)}
                  atTop={i === 0}
                  atBottom={i === slides.length - 1}
                />
                <IconBtn
                  label={`Delete slide ${i + 1}`}
                  disabled={slides.length <= 1}
                  className="text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  onClick={() => removeSlide(i)}
                >
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>

            <ImagePicker
              label="Photo"
              path={slide.src}
              pending={media.pending}
              onFile={(file) =>
                media.upload(file, {
                  maxWidth: 1600,
                  apply: (path) => patchSlide(i, { src: path }),
                })
              }
              previewClass="h-24 w-32"
              hint="Portrait crops work best — the frame is 4:5."
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextField
                label="Alt text"
                value={slide.alt}
                onChange={(v) => patchSlide(i, { alt: v })}
                hint="Describe the photo for screen readers & search."
              />
              <TextField
                label="Caption"
                value={slide.caption}
                onChange={(v) => patchSlide(i, { caption: v })}
                placeholder="Harmandir Sahib · Amritsar at dusk"
              />
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="text-[13px] text-steel">
            No slides yet — add one; the default Golden Temple slide will return if left empty.
          </p>
        )}
      </div>
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

      <HeroSlidesCard draft={draft} update={update} media={media} />

      <MediaCard
        title="Wagah section —"
        accent="border photo"
        desc="The framed Wagah Border picture beside the “Explore Amritsar” copy."
        path={draft.band.img}
        alt={draft.band.imgAlt}
        caption={draft.band.caption}
        media={media}
        onPath={(p) => setBand(() => ({ img: p }))}
        onAlt={(v) => setBand(() => ({ imgAlt: v }))}
        onCaption={(v) => setBand(() => ({ caption: v }))}
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
        desc="Header, admin gate and confirmation screens. Square-ish images work best."
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
