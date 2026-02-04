import {error} from "@sveltejs/kit";
import {produce} from "sveltekit-sse";
import type {Tracker} from "$lib/types";
import {getTracker, subscribe} from "$lib/server/tracker";

export const POST = async ({params}) => {
    const {slotName} = params;
    if (!getTracker().data[slotName]) {
        throw error(400, "Invalid Slot");
    }
    return produce(async function start({emit}) {
        const send = (tracker: Tracker) => {
            const {error} = emit('message', JSON.stringify(getSlotData(tracker, slotName)));
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


function getSlotData(tracker: Tracker, slot: string) {
    return {
        logs: tracker.logs,
        data: tracker.data[slot],
    }
}