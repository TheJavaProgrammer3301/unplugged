import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import QuoteBankPage from "~/quote-bank/quote-bank-page";
import type { Route } from "./+types/quote-bank";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "LOGIN" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function QuoteBank({ loaderData }: Route.ComponentProps) {
	return <QuoteBankPage accountInfo={loaderData.accountInfo} />;
}
