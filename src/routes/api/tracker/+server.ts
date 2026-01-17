import {subscribe, getTracker} from '$lib/server/tracker';

export function GET() {
    const stream = new ReadableStream({
        start(controller) {
            // Send current value immediately
            controller.enqueue(
                `data: ${JSON.stringify(getTracker())}\n\n`
            );

            // Subscribe to future updates
            const unsubscribe = subscribe((tracker) => {
                controller.enqueue(
                    `data: ${JSON.stringify(tracker)}\n\n`
                );
            });

            // Cleanup on disconnect
            return () => unsubscribe();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        }
    });
}
