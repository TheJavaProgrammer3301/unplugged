import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { getMessage } from "workers/api";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "NOT FOUND" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: getMessage() };
}

export default function NotFound({ loaderData }: Route.ComponentProps) {
	return <Welcome message={loaderData.message} />;
}
