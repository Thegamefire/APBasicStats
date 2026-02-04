import {produce} from "sveltekit-sse";
import type {Tracker} from "$lib/types";
import {getTracker, subscribe} from "$lib/server/tracker";

export const POST = async () => {
    return produce(async function start({emit}) {
        const send = (tracker: Tracker) => {
            const {error} = emit('message', JSON.stringify(getGeneralData(tracker)));
            if (error) {
                return cancel()
            }
        }

        const cancel = () => {

        }

        subscribe(send);
        send(getTracker());
        return cancel();
    })
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