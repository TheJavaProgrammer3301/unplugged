import ShopPage from "~/shop/shop-page";
import type { Route } from "./+types/shop";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "SHOP" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Shop({ }: Route.ComponentProps) {
	return <ShopPage />;
}
