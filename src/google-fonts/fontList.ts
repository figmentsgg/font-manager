import { Font, Script } from "../types";
import { getFontId } from "../utils/ids";
import get from "../utils/request";

const LIST_BASE_URL = "https://www.googleapis.com/webfonts/v1/webfonts";

/**
 * Font object returned by the Google API. Contains a field "subsets" which will be renamed to
 * "scripts"
 */
interface FontResponse extends Font {
	subsets: Script[];
}

/**
 * Fetch the list of all available fonts from the Google Fonts API
 */
export default async function getFontList(apiKey: string, fontNames: string[]): Promise<Font[]> {
	// Request list of all Google Fonts, sorted by popularity
	const params = new URLSearchParams();
	params.append("key", apiKey);

	fontNames.forEach((fontName) => {
		const encodedFontName = fontName.replace(/ /g, "+");
		params.append("family", encodedFontName);
	});

	const url = `${LIST_BASE_URL}?${params}`;
	const response = await get(url);

	// Parse font list
	const json = JSON.parse(response);

	// For each font:
	// - Rename "subset" key to "script"
	// - Generate fontId
	// Return the updated list
	const fontsOriginal = json.items;
	return fontsOriginal.map(
		(fontOriginal: FontResponse): Font => {
			const { family, subsets, ...others } = fontOriginal;
			return {
				...others,
				family,
				id: getFontId(family),
				scripts: subsets,
			};
		},
	);
}
