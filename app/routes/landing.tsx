import  LandingPage  from "~/landing/landing-page";
import type { Route } from "./+types/landing";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "LANDING" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Login({ }: Route.ComponentProps) {
	return <LandingPage />;
}
