import { motion } from "framer-motion";
import {
  Building2,
  Car,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  IndianRupee,
  Settings,
  UploadCloud,
} from "lucide-react";
import type { SiteContent } from "../../lib/content";
import { Btn, Card, SectionTitle, micro, type TabId } from "./ui";

/* ── Dashboard — at-a-glance status + the publishing explainer ── */

function Stat({
  label,
  value,
  sub,
  tone = "text-navy",
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border border-paper-2 bg-white p-4 sm:p-5"
    >
      <p className={micro}>{label}</p>
      <p className={`mt-2 font-display text-2xl leading-none sm:text-3xl ${tone}`}>{value}</p>
      {sub && <p className="mt-1.5 text-[11px] leading-snug text-steel">{sub}</p>}
    </motion.div>
  );
}

const STEPS = [
  { t: "Edit", d: "Change copy, fares, fleet or photos in this console." },
  { t: "Draft saved on this device", d: "Every keystroke is kept locally — nothing is public yet." },
  { t: "Publish", d: "One button sends the draft to the repo." },
  { t: "Commits to the repository", d: "site.json + any uploaded images are committed." },
  { t: "Vercel redeploys", d: "A fresh build goes out — about 60 seconds." },
  { t: "Live for every visitor", d: "The updated site is served globally." },
];

const QUICK: { id: TabId; label: string; Icon: typeof Car }[] = [
  { id: "fleet", label: "Edit fleet", Icon: Car },
  { id: "fares", label: "Edit fares", Icon: IndianRupee },
  { id: "media", label: "Swap photos", Icon: ImageIcon },
  { id: "content", label: "Rewrite copy", Icon: FileText },
  { id: "business", label: "Contact details", Icon: Building2 },
  { id: "bookings", label: "Device bookings", Icon: ClipboardList },
  { id: "settings", label: "Import / export", Icon: Settings },
];

export default function Dashboard({
  draft,
  dirty,
  pendingCount,
  bookingCount,
  goTab,
}: {
  draft: SiteContent;
  dirty: boolean;
  pendingCount: number;
  bookingCount: number;
  goTab: (t: TabId) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle
        title="Good to see you —"
        accent="here's the state of the site."
        desc="Everything you change here stays on this device until you press Publish."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat
          label="Vehicles"
          value={String(draft.fleet.length)}
          sub="in the fleet section"
          delay={0}
        />
        <Stat
          label="Routes"
          value={String(draft.routes.length)}
          sub="published fare cards"
          delay={0.04}
        />
        <Stat
          label="Destinations"
          value={String(draft.destinations.length)}
          sub="on the marquee board"
          delay={0.08}
        />
        <Stat
          label="Draft status"
          value={dirty ? "Unsaved" : "Live"}
          sub={dirty ? "changes waiting to publish" : "matches the live site"}
          tone={dirty ? "text-gold-deep" : "text-wa"}
          delay={0.12}
        />
        <Stat
          label="Pending uploads"
          value={String(pendingCount)}
          sub="of 8 images queued"
          tone={pendingCount ? "text-gold-deep" : "text-navy"}
          delay={0.16}
        />
        <Stat
          label="Bookings"
          value={String(bookingCount)}
          sub="logged on this device"
          delay={0.2}
        />
      </div>

      <Card>
        <SectionTitle
          title="How publishing"
          accent="works"
          desc="The console never edits the live site directly — it stages a draft, then ships it."
        />
        <ol className="space-y-0">
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative flex gap-4 pb-5 last:pb-0">
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[13px] top-7 h-full w-px bg-paper-2"
                />
              )}
              <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-white font-mono text-[11px] font-bold text-gold-deep">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13.5px] font-bold text-navy">{s.t}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-steel">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionTitle title="Jump" accent="straight in" />
        <div className="flex flex-wrap gap-2">
          {QUICK.map(({ id, label, Icon }) => (
            <Btn key={id} kind="ghost" onClick={() => goTab(id)}>
              <Icon size={13} /> {label}
            </Btn>
          ))}
          <Btn kind="gold" onClick={() => goTab("settings")}>
            <UploadCloud size={14} /> Publish to site
          </Btn>
        </div>
      </Card>
    </div>
  );
}
