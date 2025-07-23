import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import BadgesPage from "../badges/badges-page";
import type { Route } from "./+types/badges";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "BADGES" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ context, request }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function Badges({ loaderData }: Route.ComponentProps) {
	return <BadgesPage accountInfo={loaderData.accountInfo!} />;
}
