import  SignupPage  from "~/signup/signup-page";
import type { Route } from "./+types/signup";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "SIGNUP" },
        { name: "description", content: "The requested page could not be found." },
    ];
}

export default function Signup({ }: Route.ComponentProps) {
    return <SignupPage />;
}
