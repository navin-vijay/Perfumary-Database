import { createServerFn } from "@tanstack/react-start";
import { isLetterKey, type ExtractResult } from "./tgsc";

export const extractLetter = createServerFn({ method: "POST" })
  .validator((input: { letter: string }) => {
    const letter = input.letter.trim().toLowerCase();
    if (!isLetterKey(letter)) {
      throw new Error(`Unknown listing page: ${input.letter}`);
    }
    return { letter };
  })
  .handler(async ({ data }): Promise<ExtractResult> => {
    const { loadLetter } = await import("./tgsc-fetch.server");
    return loadLetter(data.letter);
  });
