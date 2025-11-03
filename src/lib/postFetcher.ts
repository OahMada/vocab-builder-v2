export async function postFetcher<T, ArgT>(url: string, { arg }: { arg: ArgT }): Promise<T> {
	try {
		let res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(arg),
		});

		if (!res.ok) {
			throw new Error(`Request failed: ${res.status} ${res.statusText}`);
		}
		return (await res.json()) as T;
	} catch (err) {
		throw err;
	}
}
