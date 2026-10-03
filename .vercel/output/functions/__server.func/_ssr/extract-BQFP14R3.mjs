import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as isLetterKey } from "./tgsc-Bfrw_1Zu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extract-BQFP14R3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var extractLetter_createServerFn_handler = createServerRpc({
	id: "1dc521f17c4a7f82bbfa0a1c2e19e0ca29afd62a3e757622ae4f5b3fe552dc5e",
	name: "extractLetter",
	filename: "src/lib/extract.ts"
}, (opts) => extractLetter.__executeServer(opts));
var extractLetter = createServerFn({ method: "POST" }).validator((input) => {
	const letter = input.letter.trim().toLowerCase();
	if (!isLetterKey(letter)) throw new Error(`Unknown listing page: ${input.letter}`);
	return { letter };
}).handler(extractLetter_createServerFn_handler, async ({ data }) => {
	const { loadLetter } = await import("./tgsc-fetch.server-CCYt4grn.mjs");
	return loadLetter(data.letter);
});
//#endregion
export { extractLetter_createServerFn_handler };
