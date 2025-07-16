const SESSION_COOKIE_NAME = "session";

export function getSessionId() {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`))
		?.split("=")[1];
}

export async function tryLogIn(email: string, password: string) {
	const response = await fetch("/api/log-in", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ email, password })
	});

	if (response.ok) {
		const data = await response.json() as any;

		document.cookie = `${SESSION_COOKIE_NAME}=${data.session as string}; Path=/;`;
		
		return true;
	}

	return false;
}
