import {subscribe, getTracker} from '$lib/server/tracker';
import type {Tracker} from "$lib/types";
import {error} from "@sveltejs/kit";

export function GET({params}) {
    const {slotName} = params;
    if (!getTracker().data[slotName]) {
        throw error(400, "Invalid Slot");
    }


    let closed = false;
    const stream = new ReadableStream({
        start(controller) {
            // Send current value immediately
            controller.enqueue(
                `data: ${JSON.stringify(getSlotData(getTracker(), slotName))}\n\n`
            );

            // Subscribe to future updates
            const unsubscribe = subscribe((tracker) => {
                if (!closed) {
                    controller.enqueue(
                        `data: ${JSON.stringify(getSlotData(tracker, slotName))}\n\n`
                    );
                }
            });

            // Cleanup on disconnect
            return () => unsubscribe();
        },
        cancel: _ => {
            closed = true;
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


function getSlotData(tracker: Tracker, slot: string) {
    return {
        logs: tracker.logs,
        data: tracker.data[slot],
    }
}