import {error} from "@sveltejs/kit";
import {produce} from "sveltekit-sse";
import {tracker} from "$lib/server/tracker";

export const POST = async ({params}) => {
    const {slotName} = params;
    if (!tracker.hasSlot(slotName)) {
        throw error(400, "Invalid Slot");
    }
    return produce(async function start({emit}) {
        const send = (cmd: string, data: any) => {
            const {error} = emit('message', JSON.stringify({
                cmd: cmd,
                data: data
            }));
            if (error) {
                return cancel()
            }
        }

        const cancel = () => {

        }

        const client = tracker.clients[slotName]
        client.on("SlotState", d => send("SlotState", d));
        client.on("LocationUpdate", d => send("LocationUpdate", d));
        client.on("Item", d => send("Item", d));
        client.on("Hint", d => send("Hint", d));
        send("SlotState", client.getSlotState());
        return cancel();
    })
}