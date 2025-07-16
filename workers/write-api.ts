export async function createAccount(env: Env, name: string, password: string): Promise<Response> {
	const id = crypto.randomUUID();

	const statement = env.DB.prepare("INSERT INTO users (id, name, password) VALUES (?, ?, ?)");

	statement.bind(id, name, password);

	console.log(await env.DB.prepare("SELECT 1;").all());

	try {
		await statement.run();
	} catch (error) {
		console.warn(error);
		return new Response("Error creating account", { status: 500 });
	}

	return new Response("Account created", { status: 201 });
}