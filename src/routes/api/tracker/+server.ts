import {subscribe, getTracker} from '$lib/server/tracker';
import type {Tracker} from "$lib/types";

export function GET() {

    let closed = false;
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(
                `: connected\n\n`
            );
            // Send current value immediately
            controller.enqueue(
                `data: ${JSON.stringify(getGeneralData(getTracker()))}\n\n`
            );

            // Subscribe to future updates
            const unsubscribe = subscribe((tracker) => {
                if (!closed) {
                    controller.enqueue(
                        `data: ${JSON.stringify(getGeneralData(tracker))
                        }}))}\n\n`
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


function getGeneralData(tracker: Tracker) {
    let clientData: {
        [slot: string]: {
            game: string,
            collectedChecksCount: number,
            totalChecksCount: number,
            deathCount: number
        }
    } = {}

    for (let slotName in tracker.data) {
        const originalData = tracker.data[slotName];
        clientData[slotName] = {
            game: originalData.game,
            collectedChecksCount: originalData.collectedChecks.length,
            totalChecksCount: originalData.uncollectedChecks.length + originalData.collectedChecks.length,
            deathCount: originalData.deathCount
        }
    }
    return {
        logs: tracker.logs,
        data: clientData,
    }
}