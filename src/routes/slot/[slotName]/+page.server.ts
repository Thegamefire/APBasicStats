import {getTracker} from "$lib/server/tracker";
import {error} from "@sveltejs/kit";

export function load({params}) {

    const tracker = getTracker();
    if (!tracker.data[params.slotName]) {
        throw error(400, "Invalid Slot");
    }

    return {
        slotName: params.slotName
    };
}
