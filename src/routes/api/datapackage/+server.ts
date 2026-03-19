import {tracker} from "$lib/server/tracker";
import {json} from "@sveltejs/kit";


export const GET = async ({params}) => {
    const pack = tracker.getDataPackage();
    return json(pack);
}
