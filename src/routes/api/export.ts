import { createFileRoute } from "@tanstack/react-router";
import { buildCsv, buildJson, mergeIngredients } from "@/lib/export-files";
import { isLetterKey, type IngredientLink } from "@/lib/tgsc";

export const Route = createFileRoute("/api/export")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const format = (url.searchParams.get("format") ?? "csv").toLowerCase();
        const letters = (url.searchParams.get("letters") ?? "a")
          .split(",")
          .map((part) => part.trim().toLowerCase())
          .filter(isLetterKey);

        if (letters.length === 0) {
          return new Response("Unknown listing letters", { status: 400 });
        }
        if (format !== "csv" && format !== "json") {
          return new Response("format must be csv or json", { status: 400 });
        }

        const { loadLetter } = await import("@/lib/tgsc-fetch.server");
        const groups: IngredientLink[][] = [];
        for (const letter of letters) {
          const result = await loadLetter(letter);
          groups.push(result.ingredients);
        }
        const items = mergeIngredients(groups);
        const stem = `tgsc-${letters.join("-")}-links`;

        if (format === "json") {
          return fileResponse(`${stem}.json`, "application/json", buildJson(items, letters));
        }
        return fileResponse(`${stem}.csv`, "text/csv", buildCsv(items));
      },
    },
  },
});

function fileResponse(filename: string, mime: string, body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": `${mime}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
      "Cache-Control": "no-store",
    },
  });
}
