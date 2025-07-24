import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import ShopPage from "~/shop/shop-page";
import type { Route } from "./+types/shop";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "SHOP" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ context, request }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function Shop({ loaderData }: Route.ComponentProps) {
	return <ShopPage accountInfo={loaderData.accountInfo} />;
}
