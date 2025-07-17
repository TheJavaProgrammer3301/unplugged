import SavedQuotesPage from "~/saved-quotes/saved-quotes-page";
import type { Route } from "./+types/saved-quotes";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "SAVED QUOTES" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function SavedQuotes({ }: Route.ComponentProps) {
	return <SavedQuotesPage />;
}
