import {error} from "@sveltejs/kit";
import {tracker} from "$lib/server/tracker";

export const POST = async ({params}) => {
    const {slotName} = params;
    if (!tracker.hasSlot(slotName)) {
        throw error(400, "Invalid Slot");
    }

    tracker.kill(slotName);
    return new Response("success");
}