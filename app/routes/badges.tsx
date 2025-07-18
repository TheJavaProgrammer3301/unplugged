import BadgesPage from "../badges/badges-page";
import type { Route } from "./+types/badges";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "BADGES" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Badges({ }: Route.ComponentProps) {
	return <BadgesPage />;
}
