import MindBankPage from "~/mind-bank/mind-bank-page";
import type { Route } from "./+types/mind-bank";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "MIND BANK" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function MindBank({ }: Route.ComponentProps) {
	return <MindBankPage />;
}
