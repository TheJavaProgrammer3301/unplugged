import  LoginPage  from "~/login/login-page";
import type { Route } from "./+types/login";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "LOGIN" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Login({ }: Route.ComponentProps) {
	return <LoginPage />;
}
