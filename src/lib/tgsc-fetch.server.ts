import { listingUrl, parseListingHtml, type ExtractResult, type LetterKey } from "./tgsc";

const cache = new Map<LetterKey, ExtractResult>();

export async function loadLetter(letter: LetterKey): Promise<ExtractResult> {
  const cached = cache.get(letter);
  if (cached) return cached;

  const sourceUrl = listingUrl(letter);
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (compatible; ScentIndex/1.0; +https://www.thegoodscentscompany.com)",
    },
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`TGSC returned ${response.status} for ${sourceUrl}`);
  }

  const html = await response.text();
  const result = parseListingHtml(html, letter);
  if (result.ingredients.length === 0) {
    throw new Error(`No ingredient links found on ${sourceUrl}`);
  }
  cache.set(letter, result);
  return result;
}
