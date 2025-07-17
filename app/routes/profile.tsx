import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import ProfilePage from "~/profile/profile-page";
import type { Route } from "./+types/profile";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "PROFILE" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
	return <ProfilePage accountInfo={loaderData.accountInfo!} />;
}
