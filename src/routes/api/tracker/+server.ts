import {produce} from "sveltekit-sse";
import {type GeneralData, tracker} from "$lib/server/tracker";

export const POST = async () => {
    return produce(async function start({emit}) {
        const send = (data: GeneralData) => {
            const {error} = emit('message', JSON.stringify(data));
            if (error) {
                return cancel()
            }
        }

        const cancel = () => {

        }

        tracker.on("updateGeneral", send)
        send(tracker.getGeneralData());
        return cancel();
    })
}