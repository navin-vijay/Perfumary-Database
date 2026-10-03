import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { extractLetter } from "@/lib/extract";
import { buildCsv, buildJson, displayName, mergeIngredients, triggerDownload } from "@/lib/export-files";
import {
  LETTER_PAGES,
  listingUrl,
  type ExtractResult,
  type IngredientLink,
  type LetterKey,
  type PageLink,
} from "@/lib/tgsc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 40;

type Catalog = {
  letters: LetterKey[];
  ingredients: IngredientLink[];
  pageLinks: PageLink[];
  extractedAt: string;
};

type ExportFormat = "csv" | "json";

function mergeResults(results: ExtractResult[]): Catalog {
  const pageLinks: PageLink[] = [];
  const seenUrls = new Set<string>();
  for (const result of results) {
    for (const link of result.pageLinks) {
      if (seenUrls.has(link.url)) continue;
      seenUrls.add(link.url);
      pageLinks.push(link);
    }
  }
  return {
    letters: results.map((result) => result.letter),
    ingredients: mergeIngredients(results.map((result) => result.ingredients)),
    pageLinks,
    extractedAt: results.at(-1)?.extractedAt ?? new Date().toISOString(),
  };
}

function letterLabel(letter: LetterKey): string {
  if (letter === "jk") return "J / K";
  if (letter === "wx") return "W / X";
  return letter.toUpperCase();
}

function formatBytes(chars: number): string {
  const kb = chars / 1024;
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function ScentIndex() {
  const [selected, setSelected] = useState<LetterKey>("a");
  const [allLetters, setAllLetters] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ letter: string; done: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const abortRef = useRef(false);

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    if (!q) return catalog.ingredients;
    return catalog.ingredients.filter((item) => {
      return (
        displayName(item).toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.cas.toLowerCase().includes(q) ||
        item.uses.toLowerCase().includes(q) ||
        item.kind.toLowerCase().includes(q)
      );
    });
  }, [catalog, query]);

  const exportBundle = useMemo(() => {
    if (!catalog) return null;
    const items = catalog.ingredients;
    const letters = catalog.letters;
    return {
      items,
      letters,
      csv: buildCsv(items),
      json: buildJson(items, letters),
      csvName: `tgsc-${letters.join("-")}-links.csv`,
      jsonName: `tgsc-${letters.join("-")}-links.json`,
    };
  }, [catalog]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    void runExtract(["a"]);
  }, []);

  async function runExtract(letters: LetterKey[]) {
    abortRef.current = false;
    setBusy(true);
    setError(null);
    setExportFormat(null);
    setProgress({ letter: letters[0] ?? "a", done: 0, total: letters.length });
    const collected: ExtractResult[] = [];
    try {
      for (let i = 0; i < letters.length; i += 1) {
        if (abortRef.current) break;
        const letter = letters[i]!;
        setProgress({ letter, done: i, total: letters.length });
        const result = await extractLetter({ data: { letter } });
        collected.push(result);
        setCatalog(mergeResults(collected));
        setPage(1);
      }
      if (collected.length === 0) {
        setError("Extraction was cancelled.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read TGSC.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  function onExtract() {
    void runExtract(allLetters ? [...LETTER_PAGES] : [selected]);
  }

  async function copyText(label: string, text: string, key?: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key ?? label);
      toast.success(`Copied ${label}`);
      window.setTimeout(() => setCopiedKey(null), 1400);
    } catch {
      toast.error("Clipboard is blocked — use the file preview below");
    }
  }

  const headingLetter = allLetters ? "A–Z" : letterLabel(selected);
  const activeExport =
    exportBundle && exportFormat
      ? exportFormat === "csv"
        ? {
            format: "csv" as const,
            filename: exportBundle.csvName,
            contents: exportBundle.csv,
            rows: exportBundle.items.length,
          }
        : {
            format: "json" as const,
            filename: exportBundle.jsonName,
            contents: exportBundle.json,
            rows: exportBundle.items.length,
          }
      : null;

  function downloadAll(format: ExportFormat) {
    if (!exportBundle) return;
    setExportFormat(format);
    if (format === "csv") {
      triggerDownload(exportBundle.csvName, exportBundle.csv);
      toast.success(`Downloading ${exportBundle.items.length.toLocaleString()} links as CSV`);
    } else {
      triggerDownload(exportBundle.jsonName, exportBundle.json);
      toast.success(`Downloading ${exportBundle.items.length.toLocaleString()} links as JSON`);
    }
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "font-sans border-line bg-bg-elevated text-fg",
        }}
      />
      <div className="mx-auto min-h-dvh max-w-7xl md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="border-b border-line bg-ink text-accent-fg md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0">
          <div className="flex h-full flex-col gap-8 px-6 py-7 sm:px-8">
            <div>
              <p className="text-xs font-medium tracking-widest text-accent-fg/55 uppercase">
                TGSC catalog
              </p>
              <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight">Scent Index</h1>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-accent-fg/70">
                Pull every ingredient HTML page from The Good Scents Company listings.
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-widest text-accent-fg/50 uppercase">
                  Listing
                </p>
                <button
                  type="button"
                  className="text-xs text-accent-fg/70 underline-offset-4 hover:text-accent-fg hover:underline"
                  onClick={() => setAllLetters((value) => !value)}
                >
                  {allLetters ? "Single letter" : "All letters"}
                </button>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {LETTER_PAGES.map((letter) => {
                  const active = !allLetters && selected === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setAllLetters(false);
                        setSelected(letter);
                      }}
                      className={cn(
                        "h-10 rounded-md text-xs font-medium tracking-wide transition-colors duration-150",
                        active
                          ? "bg-accent-fg text-ink"
                          : "bg-accent-fg/8 text-accent-fg/80 hover:bg-accent-fg/14",
                        allLetters && "bg-accent-fg/14 text-accent-fg",
                      )}
                    >
                      {letter.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:mt-auto">
              <p className="font-mono text-xs leading-relaxed break-all text-accent-fg/45">
                {allLetters
                  ? "allprod-a.html … allprod-z.html"
                  : `thegoodscentscompany.com/allprod-${selected}.html`}
              </p>
              <Button
                size="lg"
                disabled={busy}
                onClick={onExtract}
                className="h-12 w-full rounded-lg bg-accent-fg text-ink hover:bg-accent-fg/90"
              >
                {busy ? <Loader2 className="animate-spin" /> : <Link2 />}
                {busy
                  ? progress
                    ? `Reading ${progress.letter.toUpperCase()} · ${progress.done + 1}/${progress.total}`
                    : "Extracting"
                  : allLetters
                    ? "Extract A–Z links"
                    : `Extract ${headingLetter} links`}
              </Button>
              {busy && progress && progress.total > 1 ? (
                <button
                  type="button"
                  className="text-center text-xs text-accent-fg/60 hover:text-accent-fg"
                  onClick={() => {
                    abortRef.current = true;
                  }}
                >
                  Stop after this page
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <header className="flex flex-col gap-5 border-b border-line pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  All ingredients listing
                </p>
                <h2 className="font-display mt-1 text-3xl tracking-tight text-fg">
                  Starting with {headingLetter}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Stat
                  label="Ingredient pages"
                  value={catalog ? catalog.ingredients.length.toLocaleString() : "—"}
                />
                <Stat
                  label="Other page links"
                  value={catalog ? catalog.pageLinks.length.toLocaleString() : "—"}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                <Input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Filter by name, CAS, use, or URL"
                  className="h-11 rounded-lg pl-10"
                  aria-label="Filter extracted links"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={exportFormat === "csv" ? "default" : "outline"}
                  size="sm"
                  disabled={!exportBundle || busy}
                  onClick={() => downloadAll("csv")}
                >
                  <Download />
                  CSV
                </Button>
                <Button
                  variant={exportFormat === "json" ? "default" : "outline"}
                  size="sm"
                  disabled={!exportBundle || busy}
                  onClick={() => downloadAll("json")}
                >
                  <Download />
                  JSON
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!exportBundle}
                  onClick={() =>
                    exportBundle &&
                    copyText(
                      `${exportBundle.items.length} URLs`,
                      exportBundle.items.map((item) => item.url).join("\n"),
                      "all-urls",
                    )
                  }
                >
                  {copiedKey === "all-urls" ? <Check /> : <Copy />}
                  Copy URLs
                </Button>
              </div>
            </div>

            {activeExport ? (
              <div className="rounded-xl border border-line bg-bg-elevated p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{activeExport.filename}</p>
                    <p className="mt-1 text-sm text-muted">
                      All {activeExport.rows.toLocaleString()} HTML links ·{" "}
                      {formatBytes(activeExport.contents.length)} · {activeExport.format.toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                    onClick={() => setExportFormat(null)}
                    aria-label="Close export"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    onClick={() => triggerDownload(activeExport.filename, activeExport.contents)}
                  >
                    <Download />
                    Save {activeExport.format.toUpperCase()}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyText(activeExport.filename, activeExport.contents, "export")}
                  >
                    {copiedKey === "export" ? <Check /> : <Copy />}
                    Copy file
                  </Button>
                </div>
                <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-paper px-3 py-2 font-mono text-xs leading-relaxed text-fg">
                  {activeExport.contents.slice(0, 1800)}
                  {activeExport.contents.length > 1800 ? "\n…" : ""}
                </pre>
              </div>
            ) : null}
          </header>

          {error ? (
            <div className="mt-6 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          {busy && !catalog ? (
            <LoadingState letter={progress?.letter ?? "a"} />
          ) : catalog ? (
            <>
              <div className="mt-5 overflow-hidden rounded-xl border border-line bg-bg-elevated">
                <div className="hidden gap-3 border-b border-line px-4 py-3 text-xs font-medium tracking-wider text-subtle uppercase md:grid md:grid-cols-12">
                  <span className="md:col-span-5">Ingredient</span>
                  <span className="md:col-span-3">Use</span>
                  <span className="md:col-span-2">CAS</span>
                  <span className="text-right md:col-span-2">HTML link</span>
                </div>
                <ul>
                  {visible.length === 0 ? (
                    <li className="px-4 py-12 text-center text-sm text-muted">
                      No ingredients match that filter.
                    </li>
                  ) : (
                    visible.map((item) => {
                      const label = displayName(item);
                      return (
                        <li
                          key={`${item.letter}-${item.path}`}
                          className="grid gap-2 border-b border-line px-4 py-3 last:border-b-0 md:grid-cols-12 md:items-center md:gap-3"
                        >
                          <div className="min-w-0 md:col-span-5">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="uppercase">
                                {item.kind}
                              </Badge>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate text-sm font-medium text-accent hover:underline"
                              >
                                {label}
                              </a>
                            </div>
                            <p className="mt-1 truncate font-mono text-xs text-subtle md:hidden">
                              {item.url}
                            </p>
                          </div>
                          <p className="truncate text-sm text-muted md:col-span-3">
                            {item.uses || "—"}
                          </p>
                          <p className="font-mono text-xs text-fg tabular-nums md:col-span-2">
                            {item.cas || "—"}
                          </p>
                          <div className="flex items-center justify-end gap-1 md:col-span-2">
                            <button
                              type="button"
                              className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                              onClick={() => copyText("link", item.url, item.path)}
                              aria-label={`Copy ${label}`}
                            >
                              {copiedKey === item.path ? (
                                <Check className="size-4" />
                              ) : (
                                <Copy className="size-4" />
                              )}
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                              aria-label={`Open ${label}`}
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  Showing{" "}
                  <span className="font-medium text-fg tabular-nums">
                    {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
                    {Math.min(safePage * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  of <span className="font-medium text-fg tabular-nums">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11"
                    disabled={safePage <= 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft />
                  </Button>
                  <span className="w-16 text-center text-sm tabular-nums">
                    {safePage} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-11"
                    disabled={safePage >= pageCount}
                    onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>

              <section className="mt-10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-elevated px-4 py-3 text-left"
                  onClick={() => setNavOpen((value) => !value)}
                >
                  <span>
                    <span className="text-sm font-medium">Other HTML links on these pages</span>
                    <span className="ml-2 text-sm text-muted">
                      {catalog.pageLinks.length} nav and category URLs
                    </span>
                  </span>
                  <span className="text-sm text-accent">{navOpen ? "Hide" : "Show"}</span>
                </button>
                {navOpen ? (
                  <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg-elevated">
                    {catalog.pageLinks.map((link) => (
                      <li
                        key={link.url}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{link.label}</p>
                          <p className="truncate font-mono text-xs text-subtle">{link.url}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <p className="mt-8 mb-4 text-xs text-subtle">
                Source{" "}
                <a
                  className="text-accent hover:underline"
                  href={listingUrl(catalog.letters[0] ?? "a")}
                  target="_blank"
                  rel="noreferrer"
                >
                  thegoodscentscompany.com/allprod-{catalog.letters[0] ?? "a"}.html
                </a>
                . Data is read live from TGSC listing pages.
              </p>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg-elevated px-4 py-2">
      <p className="text-xs tracking-wider text-subtle uppercase">{label}</p>
      <p className="font-display mt-0.5 text-xl tabular-nums">{value}</p>
    </div>
  );
}

function LoadingState({ letter }: { letter: string }) {
  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
        <Loader2 className="size-4 animate-spin text-accent" />
        Reading allprod-{letter}.html and collecting ingredient page links
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex gap-4 border-b border-line px-4 py-4 last:border-b-0">
            <div className="h-4 w-48 animate-pulse rounded bg-paper" />
            <div className="hidden h-4 flex-1 animate-pulse rounded bg-paper md:block" />
            <div className="h-4 w-20 animate-pulse rounded bg-paper" />
          </div>
        ))}
      </div>
    </div>
  );
}
