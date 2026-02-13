import {error} from "@sveltejs/kit";
import {produce} from "sveltekit-sse";
import type {SlotData} from "$lib/server/archipelago";
import {tracker} from "$lib/server/tracker";

export const POST = async ({params}) => {
    const {slotName} = params;
    if (!tracker.hasSlot(slotName)) {
        throw error(400, "Invalid Slot");
    }
    return produce(async function start({emit}) {
        const send = (data: SlotData) => {
            const {error} = emit('message', JSON.stringify(data));
            if (error) {
                return cancel()
            }
        }

        const cancel = () => {

        }

        tracker.on(`updateSlot${slotName}`, send)
        send(tracker.getSlotSpecificData(slotName));
        return cancel();
    })
}