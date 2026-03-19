import {produce} from "sveltekit-sse";
import {type GeneralData, tracker} from "$lib/server/tracker";

export const POST = async () => {
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

        tracker.on("GeneralState", d => send("GeneralState", d));
        tracker.on("LocationUpdate", d => send("LocationUpdate", d));
        tracker.on("Death", d => send("Death", d));
        tracker.on("ConsoleMsg", d => send("ConsoleMsg", d));
        tracker.on("Hint", d => send("Hint", d));
        send("GeneralState", tracker.getGeneralState());
        return cancel();
    })
}