import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import SavedQuotesPage from "~/saved-quotes/saved-quotes-page";
import type { Route } from "./+types/saved-quotes";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "SAVED QUOTES" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function SavedQuotes({ loaderData }: Route.ComponentProps) {
	return <SavedQuotesPage accountInfo={loaderData.accountInfo} />;
}
