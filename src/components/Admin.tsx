import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Car,
  ClipboardList,
  ExternalLink,
  Eye,
  FileText,
  Image as Images,
  IndianRupee,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { Logo } from "./Navbar";
import type { Vehicle } from "../data";
import { loadBookings } from "../lib/booking";
import { isUnlocked, lockConsole, unlockConsole, verifyPassword } from "../lib/auth";
import {
  clearDraft,
  clone,
  contentEquals,
  loadDraft,
  saveDraft,
  useContent,
  useContentLoaded,
  type SiteContent,
} from "../lib/content";
import { prepareImage, type PendingImage } from "../lib/image";
import { publishSite, type PublishResult } from "../lib/publish";
import BusinessEditor from "./admin/BusinessEditor";
import ContentEditor from "./admin/ContentEditor";
import Dashboard from "./admin/Dashboard";
import FaresEditor from "./admin/FaresEditor";
import FleetEditor from "./admin/FleetEditor";
import MediaEditor from "./admin/MediaEditor";
import BookingsPanel from "./admin/BookingsPanel";
import SettingsPanel, { PublishPanel, type PublishState } from "./admin/SettingsPanel";
import { Btn, Spinner, micro, type MediaApi, type TabId } from "./admin/ui";

/* Session-scoped unlock; the password itself lives in src/lib/auth.ts */
const MAX_PENDING = 8;

const labelCls = "font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog";

type TabDef = { id: TabId; label: string; Icon: typeof Car };

const TABS: TabDef[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "fleet", label: "Fleet", Icon: Car },
  { id: "fares", label: "Fares", Icon: IndianRupee },
  { id: "media", label: "Media", Icon: Images },
  { id: "content", label: "Content", Icon: FileText },
  { id: "business", label: "Business", Icon: Building2 },
  { id: "bookings", label: "Bookings", Icon: ClipboardList },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

/* ── Password gate ─────────────────────────────────────────── */
function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (checking) return;
    setChecking(true);
    const ok = await verifyPassword(pin);
    setChecking(false);
    if (ok) {
      unlockConsole();
      onUnlock();
    } else {
      setBad(true);
      setPin("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-paper-2 bg-white p-8"
      >
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Dispatch Console
        </p>
        <label htmlFor="admin-pin" className={`${labelCls} mt-6 block`}>
          Password
        </label>
        <input
          id="admin-pin"
          type="password"
          autoFocus
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={72}
          disabled={checking}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setBad(false);
          }}
          placeholder="••••••••"
          className="mt-2 w-full rounded-lg border border-paper-2 bg-white px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-ink outline-none transition-colors focus:border-gold disabled:opacity-60"
        />
        <p
          className={`mt-2 h-4 text-center text-xs ${bad ? "text-red-500" : "text-transparent"}`}
          role={bad ? "alert" : undefined}
        >
          Wrong password — try again.
        </p>
        <button
          type="submit"
          disabled={checking}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800 disabled:cursor-wait disabled:opacity-80"
        >
          {checking ? (
            <>
              <Spinner size={16} /> Checking…
            </>
          ) : (
            <>
              <KeyRound size={16} strokeWidth={2.5} /> Unlock
            </>
          )}
        </button>
        <a
          href="#home"
          className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-steel transition-colors hover:text-gold-deep"
        >
          <ArrowLeft size={13} /> Back to site
        </a>
      </motion.form>
    </div>
  );
}

/* ── Loading ───────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-5 text-center">
      <span className="text-gold-deep">
        <Spinner size={26} />
      </span>
      <p className="font-display text-lg text-navy">
        Loading site <span className="text-gold-deep">content</span>…
      </p>
      <p className="max-w-xs text-[12.5px] text-steel">
        Reading the published snapshot and any saved draft on this device.
      </p>
    </div>
  );
}

/* ── Admin page (hash: #/admin) ────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed] = useState(() => isUnlocked());

  /* content + draft model */
  const live = useContent();
  const loaded = useContentLoaded();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [publishedRef, setPublishedRef] = useState<string | null>(null);

  /* shell state */
  const [tab, setTab] = useState<TabId>("dashboard");
  const [pending, setPending] = useState<PendingImage[]>([]);
  const pendingRef = useRef<PendingImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [bookingsTick, setBookingsTick] = useState(0);
  const reduce = useReducedMotion();

  /* initialise the draft once the live content resolves */
  useEffect(() => {
    if (!loaded || draft) return;
    setDraft(loadDraft() ?? clone(live));
    setPublishedRef(JSON.stringify(live));
  }, [loaded, draft, live]);

  /* react to cross-tab booking changes */
  useEffect(() => {
    const onStorage = () => setBookingsTick((t) => t + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* every console section opens at its top, not where the last one was left */
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [tab]);

  /* queued images that the draft no longer uses are dropped + revoked */
  useEffect(() => {
    if (!draft) return;
    const json = JSON.stringify(draft);
    const alive = pendingRef.current.filter((p) => json.includes(`/img/uploads/${p.name}`));
    if (alive.length === pendingRef.current.length) return;
    pendingRef.current.forEach((p) => {
      if (!alive.includes(p)) URL.revokeObjectURL(p.previewUrl);
    });
    pendingRef.current = alive;
    setPending(alive);
  }, [draft]);

  /* never lose an upload to a stray refresh */
  useEffect(() => {
    if (pending.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [pending.length]);

  /* ── edit helpers ────────────────────────────────────────── */
  const update = useCallback(
    (patch: Partial<SiteContent> | ((prev: SiteContent) => Partial<SiteContent>)) => {
      setDraft((prev) => {
        if (!prev) return prev;
        const resolved = typeof patch === "function" ? patch(prev) : patch;
        const next = { ...prev, ...resolved };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const updateFleet = useCallback(
    (i: number, patch: Partial<Vehicle>) => {
      update((prev) => ({
        fleet: prev.fleet.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
      }));
    },
    [update],
  );

  const addPending = (p: PendingImage) => {
    if (pendingRef.current.some((x) => x.name === p.name)) return;
    const next = [...pendingRef.current, p];
    pendingRef.current = next;
    setPending(next);
  };

  const removePending = (name: string) => {
    const hit = pendingRef.current.find((x) => x.name === name);
    if (hit) URL.revokeObjectURL(hit.previewUrl);
    const next = pendingRef.current.filter((x) => x.name !== name);
    pendingRef.current = next;
    setPending(next);
  };

  const uploadImage = async (
    file: File,
    opts: { maxWidth?: number; apply: (path: string) => void },
  ) => {
    if (pendingRef.current.length >= MAX_PENDING) {
      throw new Error(
        `Upload limit reached (${MAX_PENDING} pending images). Publish or remove one first.`,
      );
    }
    const prepared = await prepareImage(file, { maxWidth: opts.maxWidth ?? 1600 });
    addPending(prepared);
    opts.apply(`/img/uploads/${prepared.name}`);
  };

  const media: MediaApi = {
    pending,
    upload: uploadImage,
    remove: removePending,
  };

  /* ── draft lifecycle ─────────────────────────────────────── */
  const dirty = useMemo(() => {
    if (!draft || !publishedRef) return false;
    try {
      return !contentEquals(draft, JSON.parse(publishedRef) as SiteContent);
    } catch {
      return true;
    }
  }, [draft, publishedRef]);

  const discardDraft = () => {
    if (
      !confirm("Discard your unpublished draft and reset to the live site content?")
    ) {
      return;
    }
    clearDraft();
    setDraft(clone(live));
  };

  const importDraft = (next: SiteContent) => {
    setDraft(next);
    saveDraft(next);
  };

  const runPublish = async () => {
    if (!draft || busy) return;
    const snapshot = JSON.stringify(draft);
    setBusy(true);
    setResult(null);
    const res = await publishSite(
      draft,
      pendingRef.current.map(({ name, data }) => ({ name, data })),
    );
    setBusy(false);
    setResult(res);
    if (res.ok) {
      setPublishedRef(snapshot);
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      pendingRef.current = [];
      setPending([]);
    }
  };

  const publishState: PublishState = { busy, result, run: runPublish, dirty };
  const bookingCount = useMemo(() => loadBookings().length, [bookingsTick]);

  const logout = () => {
    lockConsole();
    setAuthed(false);
    setTab("dashboard");
  };

  if (!authed) return <Gate onUnlock={() => setAuthed(true)} />;
  if (!draft) return <LoadingScreen />;

  const renderTab = () => {
    switch (tab) {
      case "dashboard":
        return (
          <Dashboard
            draft={draft}
            dirty={dirty}
            pendingCount={pending.length}
            bookingCount={bookingCount}
            goTab={setTab}
          />
        );
      case "fleet":
        return <FleetEditor draft={draft} update={update} updateFleet={updateFleet} media={media} />;
      case "fares":
        return <FaresEditor draft={draft} update={update} />;
      case "media":
        return <MediaEditor draft={draft} update={update} media={media} />;
      case "content":
        return <ContentEditor draft={draft} update={update} />;
      case "business":
        return <BusinessEditor draft={draft} update={update} />;
      case "bookings":
        return (
          <BookingsPanel
            business={draft.business}
            tick={bookingsTick}
            onRefresh={() => setBookingsTick((t) => t + 1)}
          />
        );
      case "settings":
        return (
          <SettingsPanel
            draft={draft}
            update={update}
            publish={publishState}
            onImport={importDraft}
            onDiscard={discardDraft}
            onLogout={logout}
          />
        );
    }
  };

  const tabBadge = (id: TabId): string | null => {
    if (id === "bookings" && bookingCount > 0) return String(bookingCount);
    if (id === "fleet") return String(draft.fleet.length);
    if (id === "media" && pending.length > 0) return String(pending.length);
    return null;
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-paper-2 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <div className="hidden border-l border-paper-2 pl-3 sm:block">
              <h1 className="font-display text-lg leading-tight text-navy">
                Dispatch <span className="text-gold-deep">Console</span>
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                Arora Travels · content manager
              </p>
            </div>
            <span
              className={`rounded-md border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${
                dirty
                  ? "border-gold/50 bg-gold/10 text-gold-deep"
                  : "border-wa/50 bg-wa/10 text-wa"
              }`}
            >
              {dirty ? "● Unsaved changes" : "✓ Live"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Btn
              kind="ghost"
              onClick={() => window.open(location.pathname + "?draft", "_blank")}
              title="Open the site in a new tab with this draft applied"
            >
              <Eye size={14} /> Preview draft
            </Btn>
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel transition-colors hover:text-gold-deep"
            >
              <ExternalLink size={13} /> View site
            </a>
            <button
              type="button"
              onClick={logout}
              title="Lock the console and return to the password screen"
              className="inline-flex items-center gap-1.5 rounded-lg border border-paper-2 bg-white px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel transition-colors hover:border-red-300 hover:text-red-500"
            >
              <LogOut size={13} /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-32 pt-5 sm:px-6 lg:px-8">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden w-52 shrink-0 md:block">
          <nav aria-label="Console sections" className="sticky top-24 flex flex-col gap-1">
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              const badge = tabBadge(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                    active
                      ? "border-gold bg-white text-navy shadow-sm"
                      : "border-transparent text-steel hover:border-paper-2 hover:bg-white/70 hover:text-navy"
                  }`}
                >
                  <Icon size={15} className={active ? "text-gold-deep" : "text-fog"} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] text-steel">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {/* ── Mobile tab bar ── */}
          <nav
            aria-label="Console sections"
            className="-mx-4 mb-5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:hidden"
          >
            <div className="flex min-w-max gap-2">
              {TABS.map(({ id, label, Icon }) => {
                const active = tab === id;
                const badge = tabBadge(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                      active
                        ? "border-gold bg-white text-navy"
                        : "border-paper-2 bg-white/60 text-steel"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-gold-deep" : "text-fog"} />
                    {label}
                    {badge && (
                      <span className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[10px] text-steel">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ── Active section ── */}
          <AnimatePresence mode="wait">
            <motion.section
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
            >
              {renderTab()}
            </motion.section>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Sticky publish bar ── */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-2 bg-white/95 backdrop-blur"
          >
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className={micro}>Unsaved changes</p>
                <p className="mt-0.5 text-[12.5px] text-steel">
                  Your edits are saved on this device — publish to push them live
                  {pending.length > 0 ? ` (with ${pending.length} image${pending.length === 1 ? "" : "s"})` : ""}.
                </p>
              </div>
              <PublishPanel publish={publishState} onDiscard={discardDraft} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
