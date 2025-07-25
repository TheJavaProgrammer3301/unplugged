const SESSION_COOKIE_NAME = "session";

export function getSessionId() {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`))
		?.split("=")[1];
}

export async function tryLogIn(identifier: string, password: string, loginType: string) {
	const response = await fetch("/api/create-session", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ [loginType]: identifier, password })
	});

	const body = await response.text();

	if (response.ok) {
		const data = JSON.parse(body) as any;

		document.cookie = `${SESSION_COOKIE_NAME}=${data.session as string}; Path=/;`;
	} else throw body ?? response.statusText
}

export async function trySignUp(name: string, email: string, password: string, username: string) {
	const response = await fetch("/api/create-account-and-session", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ name, email, password, username })
	});

	const body = await response.text();

	if (response.ok) {
		const data = JSON.parse(body) as any;

		document.cookie = `${SESSION_COOKIE_NAME}=${data.session as string}; Path=/;`;
	} else throw body ?? response.statusText
}