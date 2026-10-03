import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as isLetterKey, r as listingUrl, t as LETTER_PAGES } from "./tgsc-Bfrw_1Zu.mjs";
import { a as Link2, c as Copy, d as Check, i as LoaderCircle, l as ChevronRight, o as ExternalLink, r as Search, s as Download, t as X, u as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as mergeIngredients, i as displayName, n as buildCsv, r as buildJson } from "./router-dlQU2ERt.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DrLMIALK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var extractLetter = createServerFn({ method: "POST" }).validator((input) => {
	const letter = input.letter.trim().toLowerCase();
	if (!isLetterKey(letter)) throw new Error(`Unknown listing page: ${input.letter}`);
	return { letter };
}).handler(createSsrRpc("1dc521f17c4a7f82bbfa0a1c2e19e0ca29afd62a3e757622ae4f5b3fe552dc5e"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-accent-soft text-accent",
		outline: "border border-line text-muted",
		ink: "bg-ink text-accent-fg"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-accent-soft text-accent hover:bg-line",
			outline: "border border-line bg-bg-elevated text-fg hover:bg-paper",
			ghost: "text-fg hover:bg-paper",
			danger: "bg-danger text-accent-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-[0.8125rem]",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-line bg-bg-elevated px-3 text-sm text-fg shadow-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var PAGE_SIZE = 40;
function mergeResults(results) {
	const pageLinks = [];
	const seenUrls = /* @__PURE__ */ new Set();
	for (const result of results) for (const link of result.pageLinks) {
		if (seenUrls.has(link.url)) continue;
		seenUrls.add(link.url);
		pageLinks.push(link);
	}
	return {
		letters: results.map((result) => result.letter),
		ingredients: mergeIngredients(results.map((result) => result.ingredients)),
		pageLinks,
		extractedAt: results.at(-1)?.extractedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
function letterLabel(letter) {
	if (letter === "jk") return "J / K";
	if (letter === "wx") return "W / X";
	return letter.toUpperCase();
}
function formatBytes(chars) {
	const kb = chars / 1024;
	if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
	return `${(kb / 1024).toFixed(1)} MB`;
}
function ScentIndex() {
	const [selected, setSelected] = (0, import_react.useState)("a");
	const [allLetters, setAllLetters] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [catalog, setCatalog] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [copiedKey, setCopiedKey] = (0, import_react.useState)(null);
	const [navOpen, setNavOpen] = (0, import_react.useState)(false);
	const [exportFormat, setExportFormat] = (0, import_react.useState)(null);
	const abortRef = (0, import_react.useRef)(false);
	const filtered = (0, import_react.useMemo)(() => {
		if (!catalog) return [];
		const q = query.trim().toLowerCase();
		if (!q) return catalog.ingredients;
		return catalog.ingredients.filter((item) => {
			return displayName(item).toLowerCase().includes(q) || item.url.toLowerCase().includes(q) || item.cas.toLowerCase().includes(q) || item.uses.toLowerCase().includes(q) || item.kind.toLowerCase().includes(q);
		});
	}, [catalog, query]);
	const exportBundle = (0, import_react.useMemo)(() => {
		if (!catalog) return null;
		const items = catalog.ingredients;
		const letters = catalog.letters;
		const csv = buildCsv(items);
		const json = buildJson(items, letters);
		const qs = new URLSearchParams({ letters: letters.join(",") });
		return {
			items,
			letters,
			csv,
			json,
			csvHref: `/api/export?${qs.toString()}&format=csv`,
			jsonHref: `/api/export?${qs.toString()}&format=json`,
			csvName: `tgsc-${letters.join("-")}-links.csv`,
			jsonName: `tgsc-${letters.join("-")}-links.json`
		};
	}, [catalog]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);
	const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	(0, import_react.useEffect)(() => {
		runExtract(["a"]);
	}, []);
	async function runExtract(letters) {
		abortRef.current = false;
		setBusy(true);
		setError(null);
		setExportFormat(null);
		setProgress({
			letter: letters[0] ?? "a",
			done: 0,
			total: letters.length
		});
		const collected = [];
		try {
			for (let i = 0; i < letters.length; i += 1) {
				if (abortRef.current) break;
				const letter = letters[i];
				setProgress({
					letter,
					done: i,
					total: letters.length
				});
				const result = await extractLetter({ data: { letter } });
				collected.push(result);
				setCatalog(mergeResults(collected));
				setPage(1);
			}
			if (collected.length === 0) setError("Extraction was cancelled.");
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
		runExtract(allLetters ? [...LETTER_PAGES] : [selected]);
	}
	async function copyText(label, text, key) {
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
	const activeExport = exportBundle && exportFormat ? exportFormat === "csv" ? {
		format: "csv",
		filename: exportBundle.csvName,
		href: exportBundle.csvHref,
		contents: exportBundle.csv,
		rows: exportBundle.items.length
	} : {
		format: "json",
		filename: exportBundle.jsonName,
		href: exportBundle.jsonHref,
		contents: exportBundle.json,
		rows: exportBundle.items.length
	} : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "bottom-center",
			toastOptions: { className: "font-sans border-line bg-bg-elevated text-fg" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto min-h-dvh max-w-7xl md:grid md:grid-cols-[20rem_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "border-b border-line bg-ink text-accent-fg md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-r md:border-b-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col gap-8 px-6 py-7 sm:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-accent-fg/55 uppercase",
								children: "TGSC catalog"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display mt-3 text-4xl leading-tight tracking-tight",
								children: "Scent Index"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xs text-sm leading-relaxed text-accent-fg/70",
								children: "Pull every ingredient HTML page from The Good Scents Company listings."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-accent-fg/50 uppercase",
								children: "Listing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-accent-fg/70 underline-offset-4 hover:text-accent-fg hover:underline",
								onClick: () => setAllLetters((value) => !value),
								children: allLetters ? "Single letter" : "All letters"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-8 gap-1.5",
							children: LETTER_PAGES.map((letter) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => {
										setAllLetters(false);
										setSelected(letter);
									},
									className: cn("h-10 rounded-md text-xs font-medium tracking-wide transition-colors duration-150", !allLetters && selected === letter ? "bg-accent-fg text-ink" : "bg-accent-fg/8 text-accent-fg/80 hover:bg-accent-fg/14", allLetters && "bg-accent-fg/14 text-accent-fg"),
									children: letter.toUpperCase()
								}, letter);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 md:mt-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs leading-relaxed break-all text-accent-fg/45",
									children: allLetters ? "allprod-a.html … allprod-z.html" : `thegoodscentscompany.com/allprod-${selected}.html`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									disabled: busy,
									onClick: onExtract,
									className: "h-12 w-full rounded-lg bg-accent-fg text-ink hover:bg-accent-fg/90",
									children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {}), busy ? progress ? `Reading ${progress.letter.toUpperCase()} · ${progress.done + 1}/${progress.total}` : "Extracting" : allLetters ? "Extract A–Z links" : `Extract ${headingLetter} links`]
								}),
								busy && progress && progress.total > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-center text-xs text-accent-fg/60 hover:text-accent-fg",
									onClick: () => {
										abortRef.current = true;
									},
									children: "Stop after this page"
								}) : null
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-col gap-5 border-b border-line pb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-end justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-widest text-muted uppercase",
									children: "All ingredients listing"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display mt-1 text-3xl tracking-tight text-fg",
									children: ["Starting with ", headingLetter]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Ingredient pages",
										value: catalog ? catalog.ingredients.length.toLocaleString() : "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Other page links",
										value: catalog ? catalog.pageLinks.length.toLocaleString() : "—"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 md:flex-row md:items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (event) => {
											setQuery(event.target.value);
											setPage(1);
										},
										placeholder: "Filter by name, CAS, use, or URL",
										className: "h-11 rounded-lg pl-10",
										"aria-label": "Filter extracted links"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: exportFormat === "csv" ? "default" : "outline",
											size: "sm",
											disabled: !exportBundle,
											onClick: () => setExportFormat("csv"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "CSV"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: exportFormat === "json" ? "default" : "outline",
											size: "sm",
											disabled: !exportBundle,
											onClick: () => setExportFormat("json"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "JSON"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "secondary",
											size: "sm",
											disabled: !exportBundle,
											onClick: () => exportBundle && copyText(`${exportBundle.items.length} URLs`, exportBundle.items.map((item) => item.url).join("\n"), "all-urls"),
											children: [copiedKey === "all-urls" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), "Copy URLs"]
										})
									]
								})]
							}),
							activeExport ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-line bg-bg-elevated p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: activeExport.filename
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-sm text-muted",
											children: [
												activeExport.rows.toLocaleString(),
												" links · ",
												formatBytes(activeExport.contents.length),
												" ·",
												" ",
												activeExport.format.toUpperCase()
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
											onClick: () => setExportFormat(null),
											"aria-label": "Close export",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: activeExport.href,
												download: activeExport.filename,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}),
													"Save ",
													activeExport.format.toUpperCase()
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => copyText(activeExport.filename, activeExport.contents, "export"),
											children: [copiedKey === "export" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), "Copy file"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
										className: "mt-3 max-h-40 overflow-auto rounded-lg bg-paper px-3 py-2 font-mono text-xs leading-relaxed text-fg",
										children: [activeExport.contents.slice(0, 1800), activeExport.contents.length > 1800 ? "\n…" : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-subtle",
										children: "Save downloads every extracted HTML link. If the browser blocks the file, use Copy file."
									})
								]
							}) : null
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger",
						children: error
					}) : null,
					busy && !catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { letter: progress?.letter ?? "a" }) : catalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 overflow-hidden rounded-xl border border-line bg-bg-elevated",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden gap-3 border-b border-line px-4 py-3 text-xs font-medium tracking-wider text-subtle uppercase md:grid md:grid-cols-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "md:col-span-5",
										children: "Ingredient"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "md:col-span-3",
										children: "Use"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "md:col-span-2",
										children: "CAS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-right md:col-span-2",
										children: "HTML link"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-4 py-12 text-center text-sm text-muted",
								children: "No ingredients match that filter."
							}) : visible.map((item) => {
								const label = displayName(item);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "grid gap-2 border-b border-line px-4 py-3 last:border-b-0 md:grid-cols-12 md:items-center md:gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 md:col-span-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "uppercase",
													children: item.kind
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: item.url,
													target: "_blank",
													rel: "noreferrer",
													className: "truncate text-sm font-medium text-accent hover:underline",
													children: label
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 truncate font-mono text-xs text-subtle md:hidden",
												children: item.url
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm text-muted md:col-span-3",
											children: item.uses || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-fg tabular-nums md:col-span-2",
											children: item.cas || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1 md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
												onClick: () => copyText("link", item.url, item.path),
												"aria-label": `Copy ${label}`,
												children: copiedKey === item.path ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: item.url,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
												"aria-label": `Open ${label}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
											})]
										})
									]
								}, `${item.letter}-${item.path}`);
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Showing",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-fg tabular-nums",
										children: [
											filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1,
											"–",
											Math.min(safePage * PAGE_SIZE, filtered.length)
										]
									}),
									" ",
									"of ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-fg tabular-nums",
										children: filtered.length
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "size-11",
										disabled: safePage <= 1,
										onClick: () => setPage((value) => Math.max(1, value - 1)),
										"aria-label": "Previous page",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-16 text-center text-sm tabular-nums",
										children: [
											safePage,
											" / ",
											pageCount
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "size-11",
										disabled: safePage >= pageCount,
										onClick: () => setPage((value) => Math.min(pageCount, value + 1)),
										"aria-label": "Next page",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center justify-between rounded-xl border border-line bg-bg-elevated px-4 py-3 text-left",
								onClick: () => setNavOpen((value) => !value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: "Other HTML links on these pages"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-sm text-muted",
									children: [catalog.pageLinks.length, " nav and category URLs"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-accent",
									children: navOpen ? "Hide" : "Show"
								})]
							}), navOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg-elevated",
								children: catalog.pageLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 px-4 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: link.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-mono text-xs text-subtle",
											children: link.url
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: link.url,
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-fg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
									})]
								}, link.url))
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-8 mb-4 text-xs text-subtle",
							children: [
								"Source",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "text-accent hover:underline",
									href: listingUrl(catalog.letters[0] ?? "a"),
									target: "_blank",
									rel: "noreferrer",
									children: [
										"thegoodscentscompany.com/allprod-",
										catalog.letters[0] ?? "a",
										".html"
									]
								}),
								". CSV and JSON include every extracted ingredient HTML link."
							]
						})
					] }) : null
				]
			})]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-bg-elevated px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wider text-subtle uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-0.5 text-xl tabular-nums",
			children: value
		})]
	});
}
function LoadingState({ letter }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-3 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-accent" }),
				"Reading allprod-",
				letter,
				".html and collecting ingredient page links"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-line bg-bg-elevated",
			children: Array.from({ length: 8 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 border-b border-line px-4 py-4 last:border-b-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-48 animate-pulse rounded bg-paper" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-4 flex-1 animate-pulse rounded bg-paper md:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-20 animate-pulse rounded bg-paper" })
				]
			}, index))
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScentIndex, {});
}
//#endregion
export { Home as component };
