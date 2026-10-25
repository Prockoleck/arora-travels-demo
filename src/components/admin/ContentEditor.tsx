import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import type { SiteContent } from "../../lib/content";
import {
  Btn,
  Card,
  IconBtn,
  ListEditor,
  SectionTitle,
  TextAreaField,
  TextField,
  micro,
  type DraftProps,
} from "./ui";

/* ── Content — every word on the site, section by section ────── */

function RowCard({
  index,
  title,
  subtitle,
  onRemove,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-paper-2 pb-3">
        <div className="min-w-0">
          <span className={micro}>
            {title} {index.toString().padStart(2, "0")}
          </span>
          <p className="mt-1 truncate text-[13.5px] font-bold text-navy">
            {subtitle || "Untitled"}
          </p>
        </div>
        <IconBtn
          label="Delete"
          onClick={onRemove}
          className="text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={14} />
        </IconBtn>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

export default function ContentEditor({ draft, update }: DraftProps) {
  const hero = draft.hero;
  const band = draft.band;

  const replace = <K extends keyof SiteContent>(
    key: K,
    next: SiteContent[K],
  ) => update({ [key]: next } as Partial<SiteContent>);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Site"
        accent="copy"
        desc="Headlines, stats, lists and testimonials — what visitors actually read."
      />

      {/* ── Hero ── */}
      <Card>
        <SectionTitle
          title="Hero"
          accent="headline"
          desc="The opening screen. Accent word renders in gold; badge is the small “SINCE ’97” plate."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Eyebrow"
            value={hero.eyebrow}
            onChange={(v) => replace("hero", { ...hero, eyebrow: v })}
          />
          <TextField
            label="Badge"
            value={hero.badge}
            onChange={(v) => replace("hero", { ...hero, badge: v })}
          />
          <TextField
            label="Line 1"
            value={hero.line1}
            onChange={(v) => replace("hero", { ...hero, line1: v })}
          />
          <TextField
            label="Line 2"
            value={hero.line2}
            onChange={(v) => replace("hero", { ...hero, line2: v })}
          />
          <TextField
            className="sm:col-span-2"
            label="Accent word"
            value={hero.accent}
            onChange={(v) => replace("hero", { ...hero, accent: v })}
            hint="Rendered in gold after line 2."
          />
        </div>
        <div className="mt-4 grid gap-3">
          <TextField
            label="Sub-line — before"
            value={hero.subA}
            onChange={(v) => replace("hero", { ...hero, subA: v })}
          />
          <TextField
            label="Sub-line — emphasis"
            value={hero.subBold}
            onChange={(v) => replace("hero", { ...hero, subBold: v })}
            hint="Renders as emphasized white text; leave empty to disable."
          />
          <TextField
            label="Sub-line — after"
            value={hero.subEnd}
            onChange={(v) => replace("hero", { ...hero, subEnd: v })}
          />
          <TextField
            label="Button label"
            value={hero.cta}
            onChange={(v) => replace("hero", { ...hero, cta: v })}
          />
        </div>
      </Card>

      {/* ── Band ── */}
      <Card>
        <SectionTitle title="Band" accent="copy" desc="The mid-page “Explore Amritsar” strip." />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Eyebrow"
            value={band.eyebrow}
            onChange={(v) => replace("band", { ...band, eyebrow: v })}
          />
          <TextField
            label="Button label"
            value={band.cta}
            onChange={(v) => replace("band", { ...band, cta: v })}
          />
          <TextField
            label="Pre-accent text"
            value={band.pre}
            onChange={(v) => replace("band", { ...band, pre: v })}
          />
          <TextField
            label="Accent text"
            value={band.accent}
            onChange={(v) => replace("band", { ...band, accent: v })}
            hint="Rendered in gold after the pre-accent text."
          />
          <TextAreaField
            className="sm:col-span-2"
            label="Body"
            value={band.text}
            onChange={(v) => replace("band", { ...band, text: v })}
          />
        </div>
      </Card>

      {/* ── Stats ── */}
      <Card>
        <SectionTitle
          title="Counter"
          accent="stats"
          desc="The animated numbers in the About section."
          right={
            <Btn
              kind="primary"
              onClick={() => replace("stats", [...draft.stats, { value: 28, suffix: "+", label: "Years" }])}
            >
              <Plus size={14} /> Add stat
            </Btn>
          }
        />
        <div className="space-y-3">
          {draft.stats.map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[120px_100px_1fr_auto]">
              <TextField
                label="Value"
                value={String(s.value)}
                onChange={(v) =>
                  replace(
                    "stats",
                    draft.stats.map((x, idx) =>
                      idx === i ? { ...x, value: Number(v) || 0 } : x,
                    ),
                  )
                }
              />
              <TextField
                label="Suffix"
                value={s.suffix}
                onChange={(v) =>
                  replace("stats", draft.stats.map((x, idx) => (idx === i ? { ...x, suffix: v } : x)))
                }
                placeholder="+"
              />
              <TextField
                label="Label"
                value={s.label}
                onChange={(v) =>
                  replace("stats", draft.stats.map((x, idx) => (idx === i ? { ...x, label: v } : x)))
                }
                placeholder="Years on the road"
              />
              <div className="flex items-end pb-1">
                <IconBtn
                  label="Delete stat"
                  className="text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  onClick={() => replace("stats", draft.stats.filter((_, idx) => idx !== i))}
                >
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>
          ))}
          {draft.stats.length === 0 && (
            <p className="text-[13px] text-steel">No stats — the counter block stays hidden.</p>
          )}
        </div>
      </Card>

      {/* ── Destinations ── */}
      <Card>
        <SectionTitle
          title="Destination"
          accent="board"
          desc="The scrolling marquee of places you serve."
        />
        <ListEditor
          items={draft.destinations}
          onChange={(next) => replace("destinations", next)}
          itemLabel="destination"
          placeholder="Golden Temple"
          addLabel="Add destination"
          reorder
        />
      </Card>

      {/* ── Services ── */}
      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-navy sm:text-xl">
              Service <span className="text-gold-deep">cards</span>
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-steel">
              Four numbered offerings. The number chip is fixed and auto-assigned.
            </p>
          </div>
          <Btn
            kind="primary"
            onClick={() =>
              replace("services", [
                ...draft.services,
                {
                  n: String(draft.services.length + 1).padStart(2, "0"),
                  title: "New service",
                  desc: "",
                  includes: [],
                },
              ])
            }
          >
            <Plus size={14} /> Add service
          </Btn>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.services.map((s, i) => (
            <Card key={i}>
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-paper-2 pb-3">
                <div>
                  <span className={micro}>Service {s.n}</span>
                  <p className="mt-1 truncate font-display text-base text-navy">
                    {s.title || "Untitled"}
                  </p>
                </div>
                <IconBtn
                  label="Delete service"
                  className="text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  onClick={() => {
                    if (!confirm(`Delete service ${s.n} — ${s.title}?`)) return;
                    replace("services", draft.services.filter((_, idx) => idx !== i));
                  }}
                >
                  <Trash2 size={14} />
                </IconBtn>
              </div>
              <div className="grid gap-3">
                <TextField
                  label="Title"
                  value={s.title}
                  onChange={(v) =>
                    replace(
                      "services",
                      draft.services.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
                    )
                  }
                />
                <TextAreaField
                  label="Description"
                  value={s.desc}
                  onChange={(v) =>
                    replace(
                      "services",
                      draft.services.map((x, idx) => (idx === i ? { ...x, desc: v } : x)),
                    )
                  }
                />
                <TextField
                  label="Includes"
                  value={s.includes.join(", ")}
                  onChange={(v) =>
                    replace(
                      "services",
                      draft.services.map((x, idx) =>
                        idx === i
                          ? {
                              ...x,
                              includes: v
                                .split(",")
                                .map((p) => p.trim())
                                .filter(Boolean),
                            }
                          : x,
                      ),
                    )
                  }
                  hint="Comma-separated — one bullet per item."
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Reasons ── */}
      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-navy sm:text-xl">
              Why choose <span className="text-gold-deep">us</span>
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-steel">
              The reasons grid under the chauffeur photo.
            </p>
          </div>
          <Btn
            kind="primary"
            onClick={() =>
              replace("reasons", [...draft.reasons, { title: "New reason", desc: "" }])
            }
          >
            <Plus size={14} /> Add reason
          </Btn>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.reasons.map((r, i) => (
            <RowCard
              key={i}
              index={i + 1}
              title="Reason"
              subtitle={r.title}
              onRemove={() => {
                if (!confirm(`Delete reason "${r.title}"?`)) return;
                replace("reasons", draft.reasons.filter((_, idx) => idx !== i));
              }}
            >
              <TextField
                className="sm:col-span-2"
                label="Title"
                value={r.title}
                onChange={(v) =>
                  replace(
                    "reasons",
                    draft.reasons.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
                  )
                }
              />
              <TextAreaField
                className="sm:col-span-2"
                label="Description"
                value={r.desc}
                onChange={(v) =>
                  replace(
                    "reasons",
                    draft.reasons.map((x, idx) => (idx === i ? { ...x, desc: v } : x)),
                  )
                }
              />
            </RowCard>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-navy sm:text-xl">
              Company <span className="text-gold-deep">timeline</span>
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-steel">
              Milestones down the right-hand column of the About section.
            </p>
          </div>
          <Btn
            kind="primary"
            onClick={() =>
              replace("timeline", [
                ...draft.timeline,
                { year: "", title: "New milestone", text: "" },
              ])
            }
          >
            <Plus size={14} /> Add milestone
          </Btn>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.timeline.map((t, i) => (
            <RowCard
              key={i}
              index={i + 1}
              title="Milestone"
              subtitle={t.title}
              onRemove={() => {
                if (!confirm(`Delete milestone "${t.title}"?`)) return;
                replace("timeline", draft.timeline.filter((_, idx) => idx !== i));
              }}
            >
              <TextField
                label="Year"
                value={t.year}
                onChange={(v) =>
                  replace(
                    "timeline",
                    draft.timeline.map((x, idx) => (idx === i ? { ...x, year: v } : x)),
                  )
                }
                placeholder="2004"
              />
              <TextField
                label="Title"
                value={t.title}
                onChange={(v) =>
                  replace(
                    "timeline",
                    draft.timeline.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
                  )
                }
              />
              <TextAreaField
                className="sm:col-span-2"
                label="Text"
                value={t.text}
                onChange={(v) =>
                  replace(
                    "timeline",
                    draft.timeline.map((x, idx) => (idx === i ? { ...x, text: v } : x)),
                  )
                }
              />
            </RowCard>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-navy sm:text-xl">
              Passenger <span className="text-gold-deep">voices</span>
            </h2>
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-steel">
              Quotes shown in the testimonials strip.
            </p>
          </div>
          <Btn
            kind="primary"
            onClick={() =>
              replace("testimonials", [
                ...draft.testimonials,
                { quote: "", name: "", role: "" },
              ])
            }
          >
            <Plus size={14} /> Add testimonial
          </Btn>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.testimonials.map((q, i) => (
            <RowCard
              key={i}
              index={i + 1}
              title="Testimonial"
              subtitle={q.name}
              onRemove={() => {
                if (!confirm(`Delete testimonial from "${q.name}"?`)) return;
                replace("testimonials", draft.testimonials.filter((_, idx) => idx !== i));
              }}
            >
              <TextAreaField
                className="sm:col-span-2"
                label="Quote"
                rows={4}
                value={q.quote}
                onChange={(v) =>
                  replace(
                    "testimonials",
                    draft.testimonials.map((x, idx) => (idx === i ? { ...x, quote: v } : x)),
                  )
                }
              />
              <TextField
                label="Name"
                value={q.name}
                onChange={(v) =>
                  replace(
                    "testimonials",
                    draft.testimonials.map((x, idx) => (idx === i ? { ...x, name: v } : x)),
                  )
                }
              />
              <TextField
                label="Role"
                value={q.role}
                onChange={(v) =>
                  replace(
                    "testimonials",
                    draft.testimonials.map((x, idx) => (idx === i ? { ...x, role: v } : x)),
                  )
                }
                placeholder="Business traveller · Delhi"
              />
            </RowCard>
          ))}
        </div>
      </div>

      {/* ── Photo credit ── */}
      <Card>
        <SectionTitle
          title="Photo"
          accent="credit"
          desc="Attribution line in the footer — keep licence requirements satisfied."
        />
        <TextAreaField
          label="Credit text"
          rows={3}
          value={draft.photoCredit}
          onChange={(v) => replace("photoCredit", v)}
        />
      </Card>
    </div>
  );
}
