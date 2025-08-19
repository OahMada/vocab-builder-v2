export function toStream<T>(data: T) {
	let encoder = new TextEncoder();
	let stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
			controller.close();
		},
	});
	return stream;
}
