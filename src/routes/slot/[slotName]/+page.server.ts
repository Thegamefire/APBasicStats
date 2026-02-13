import {tracker} from "$lib/server/tracker";
import {error} from "@sveltejs/kit";

export function load({params}) {

    if (!tracker.hasSlot(params.slotName)) {
        throw error(400, "Invalid Slot");
    }

    return {
        slotName: params.slotName
    };
}
