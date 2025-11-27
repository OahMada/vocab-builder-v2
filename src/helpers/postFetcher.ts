export async function postFetcher<T, ArgT>(url: string, { arg }: { arg: ArgT }): Promise<T> {
	try {
		let res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(arg),
		});

		let data = await res.json();
		if (!res.ok) {
			throw new Error(`${data.error}`);
		}
		return data as T;
	} catch (err) {
		throw err;
	}
}
