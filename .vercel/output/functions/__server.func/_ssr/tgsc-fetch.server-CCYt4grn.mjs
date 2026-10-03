import { i as parseListingHtml, r as listingUrl } from "./tgsc-Bfrw_1Zu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tgsc-fetch.server-CCYt4grn.js
var cache = /* @__PURE__ */ new Map();
async function loadLetter(letter) {
	const cached = cache.get(letter);
	if (cached) return cached;
	const sourceUrl = listingUrl(letter);
	const response = await fetch(sourceUrl, {
		headers: {
			Accept: "text/html,application/xhtml+xml",
			"User-Agent": "Mozilla/5.0 (compatible; ScentIndex/1.0; +https://www.thegoodscentscompany.com)"
		},
		signal: AbortSignal.timeout(25e3)
	});
	if (!response.ok) throw new Error(`TGSC returned ${response.status} for ${sourceUrl}`);
	const html = await response.text();
	const result = parseListingHtml(html, letter);
	if (result.ingredients.length === 0) throw new Error(`No ingredient links found on ${sourceUrl}`);
	cache.set(letter, result);
	return result;
}
//#endregion
export { loadLetter };
