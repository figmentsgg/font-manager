export default function get(url: string): Promise<any> {
	return fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`Response has status code ${response.status}`);
		}
		return response.json();
	});
}
