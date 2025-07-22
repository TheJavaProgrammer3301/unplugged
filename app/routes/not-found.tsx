import  NotFoundPage  from "~/not-found/not-found-page";
import type { Route } from "./+types/not-found";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "NOT FOUND" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function NotFound({ }: Route.ComponentProps) {
	return <NotFoundPage />;
}
