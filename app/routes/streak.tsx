import StreakPage from "~/streak/streak-page";
import type { Route } from "./+types/streak";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "STREAK" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Streak({ }: Route.ComponentProps) {
	return <StreakPage />;
}
