import QuoteBankPage from "~/quote-bank/quote-bank-page";
import type { Route } from "./+types/quote-bank";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "LOGIN" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function QuoteBank({ }: Route.ComponentProps) {
	return <QuoteBankPage />;
}
