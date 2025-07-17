import ProfilePage from "~/profile/profile-page";
import type { Route } from "./+types/profile";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "PROFILE" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Profile({ }: Route.ComponentProps) {
	return <ProfilePage />;
}
