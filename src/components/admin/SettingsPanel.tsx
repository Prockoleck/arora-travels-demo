import { useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, CheckCircle2, Download, Upload } from "lucide-react";
import { mergeContent, type SiteContent } from "../../lib/content";
import type { PublishResult } from "../../lib/publish";
import { Btn, Card, Note, SectionTitle, Spinner, type DraftProps } from "./ui";

/* ── Settings — export / import / discard / publish ──────────── */

export type PublishState = {
  busy: boolean;
  result: PublishResult | null;
  run: () => void;
  dirty: boolean;
};

/** Shared by the Settings tab and the sticky bottom bar. */
export function PublishPanel({
  publish,
  onDiscard,
  compact = false,
}: {
  publish: PublishState;
  onDiscard: () => void;
  compact?: boolean;
}) {
  const { busy, result, run, dirty } = publish;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex flex-wrap items-center gap-3">
        <Btn kind="gold" onClick={run} disabled={busy || !dirty} aria-busy={busy}>
          {busy ? (
            <>
              <Spinner /> Publishing…
            </>
          ) : (
            "Publish to site"
          )}
        </Btn>
        <Btn kind="danger" onClick={onDiscard} disabled={busy}>
          Discard draft
        </Btn>
        {!dirty && !busy && (
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-wa">
            ✓ Everything is published
          </span>
        )}
      </div>

      {result?.ok === true && (
        <div className="flex items-start gap-3 rounded-xl border border-wa/40 bg-wa/5 px-4 py-3.5">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-wa" />
          <div className="min-w-0 text-[13px] leading-relaxed text-ink">
            <p className="font-bold text-navy">
              Published — the live site updates in about a minute.
            </p>
            <p className="mt-1 text-steel">
              {result.files} file{result.files === 1 ? "" : "s"} committed.{" "}
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gold-deep underline decoration-gold/50 underline-offset-2 hover:text-gold"
                >
                  View the commit →
                </a>
              )}
            </p>
          </div>
        </div>
      )}

      {result && result.ok === false && (
        <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3.5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <div className="min-w-0 text-[13px] leading-relaxed">
            <p className="font-bold text-red-500">Publish failed.</p>
            <p className="mt-1 text-red-500/90">
              {result.error === "NOT_CONFIGURED"
                ? "Publishing is not configured on this deployment."
                : result.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPanel({
  draft,
  publish,
  onImport,
  onDiscard,
}: DraftProps & {
  publish: PublishState;
  onImport: (next: SiteContent) => void;
  onDiscard: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");

  const exportJson = () => {
    try {
      const blob = new Blob([JSON.stringify(draft, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "site-content.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setNote("Draft exported as site-content.json.");
    } catch {
      setNote("Export failed — the browser blocked the download.");
    }
  };

  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const json = JSON.parse(String(fr.result || ""));
        const ok = confirm(
          "Replace the current draft with this file?\n\nThe live site stays unchanged until you publish.",
        );
        if (!ok) return;
        onImport(mergeContent(json));
        setNote(`Imported ${file.name} — review it, then publish.`);
      } catch {
        setNote("That file isn’t valid JSON — nothing was changed.");
      }
    };
    fr.onerror = () => setNote("Could not read that file.");
    fr.readAsText(file);
  };

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Draft &"
        accent="publish"
        desc="The draft lives in this browser. Publishing commits it to the repository and redeploys the site."
      />

      <Card>
        <SectionTitle
          title="Publish"
          accent="to the live site"
          desc="Commits public/content/site.json plus any queued images, then Vercel rebuilds — roughly 60 seconds."
        />
        <PublishPanel publish={publish} onDiscard={onDiscard} />
      </Card>

      <Card>
        <SectionTitle
          title="Export"
          accent="backup"
          desc="Download the current draft as JSON — useful before a big edit or to move it to another machine."
        />
        <Btn kind="primary" onClick={exportJson}>
          <Download size={14} /> Export draft JSON
        </Btn>
      </Card>

      <Card>
        <SectionTitle
          title="Import"
          accent="restore"
          desc="Load a previously exported file. It replaces the working draft (never the live site)."
        />
        <div className="flex flex-wrap items-center gap-3">
          <Btn kind="ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Import JSON…
          </Btn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={pickFile}
          />
        </div>
        {note && <p className="mt-3 text-[12.5px] text-steel">{note}</p>}
      </Card>

      <Card>
        <SectionTitle
          title="Discard"
          accent="draft"
          desc="Throw away every local change and start again from the live content."
        />
        <Btn kind="danger" onClick={onDiscard} disabled={publish.busy}>
          <AlertTriangle size={13} /> Discard draft
        </Btn>
        <Note>
          Discarding cannot be undone — anything unpublished is lost. Export a backup first if
          you’re unsure.
        </Note>
      </Card>
    </div>
  );
}
