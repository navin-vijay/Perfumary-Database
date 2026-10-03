//#region node_modules/.nitro/vite/services/ssr/assets/tgsc-Bfrw_1Zu.js
var TGSC_ORIGIN = "https://www.thegoodscentscompany.com";
/** TGSC groups J/K and W/X onto shared listing pages. */
var LETTER_PAGES = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"jk",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"wx",
	"y",
	"z"
];
function isLetterKey(value) {
	return LETTER_PAGES.includes(value);
}
function listingUrl(letter) {
	return `${TGSC_ORIGIN}/allprod-${letter}.html`;
}
var ENTITY_MAP = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: "\"",
	apos: "'",
	nbsp: " "
};
function decodeEntities(value) {
	return value.replace(/&#(\d+);/g, (_, n) => {
		const code = Number(n);
		return Number.isFinite(code) ? String.fromCharCode(code) : _;
	}).replace(/&#x([0-9a-f]+);/gi, (_, n) => {
		const code = Number.parseInt(n, 16);
		return Number.isFinite(code) ? String.fromCharCode(code) : _;
	}).replace(/&([a-z]+);/gi, (match, name) => {
		return ENTITY_MAP[name.toLowerCase()] ?? match;
	});
}
function stripTags(html) {
	return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}
function firstMatch(source, pattern) {
	return source.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}
var ROW_RE = /<td>(?:\s*<div class="chtols">([\s\S]*?)<\/div>)?\s*<a href="#" onclick="openMainWindow\('(\/data\/[^']+)'\);return false;">([\s\S]*?)<\/a>([\s\S]*?)<\/td>/gi;
var HREF_RE = /<a\b[^>]*href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
function parseListingHtml(html, letter) {
	const ingredients = [];
	const seenPaths = /* @__PURE__ */ new Set();
	for (const match of html.matchAll(ROW_RE)) {
		const prefix = stripTags(match[1] ?? "");
		const path = match[2] ?? "";
		const name = stripTags(match[3] ?? "");
		const rest = match[4] ?? "";
		if (!path || !name || seenPaths.has(path)) continue;
		seenPaths.add(path);
		const restText = stripTags(rest);
		const kind = (path.split("/").pop() ?? "").replace(/\d.*$/, "").replace(/\.html$/i, "") || "data";
		ingredients.push({
			name,
			prefix,
			path,
			url: `${TGSC_ORIGIN}${path}`,
			cas: firstMatch(restText, /CAS:\s*([0-9][0-9\-., ]*)/i),
			uses: firstMatch(restText, /Use\(s\):\s*(.+)$/i),
			kind,
			letter
		});
	}
	const pageLinks = [];
	const seenHrefs = /* @__PURE__ */ new Set();
	for (const match of html.matchAll(HREF_RE)) {
		const href = (match[1] ?? "").trim();
		if (!href || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
		const absolute = href.startsWith("http") ? href : `${TGSC_ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;
		if (seenHrefs.has(absolute)) continue;
		seenHrefs.add(absolute);
		pageLinks.push({
			href,
			url: absolute,
			label: stripTags(match[2] ?? "") || href
		});
	}
	const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i) || `All Ingredients Listing : Starting with ${letter.toUpperCase()}`;
	return {
		letter,
		sourceUrl: listingUrl(letter),
		title: stripTags(title),
		ingredients,
		pageLinks,
		extractedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { parseListingHtml as i, isLetterKey as n, listingUrl as r, LETTER_PAGES as t };
