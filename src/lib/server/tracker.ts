import { EventEmitter } from "node:events";
import {type Config, getConfig} from "$lib/server/config";
import {ClientManager} from "$lib/server/archipelago";
import {ColorMessageNode as ApColorMessageNode, type Hint as ApHint, ItemMessageNode as ApItemMessageNode, type MessageNode as ApMessageNode} from "archipelago.js"

class Tracker extends EventEmitter {
    private config: Config;
    private readonly clients: { [slot: string]: ClientManager};

    private readonly logs: LogNode[][];
    private readonly hints: Hint[];

    constructor(config: Config) {
        super();
        this.config = config;
        this.logs = [];
        this.hints = [];
        this.clients = {};

        for (let slot of this.config.ap_slots) {
            const client = new ClientManager(slot)
            this.clients[slot[0]] = client;
            client.on("update", ()=> this.sendUpdate(slot[0]))
            client.connect();
        }
        const mainClient = this.clients[this.config.ap_slots[0][0]];
        mainClient.client.items.on("hintReceived", this.onHint);
        mainClient.client.messages.on("message", this.onMessage);
    }

    onHint = (hint: ApHint) => {
        this.hints.push({
            item: hint.item.name,
            location: hint.item.locationName,
            receiver: hint.item.receiver.name,
            sender: hint.item.sender.name,
            progression: hint.item.progression,
        })
    }

    onMessage = (text: string, nodes: ApMessageNode[]) => {
        if (!Tracker.shouldIgnoreMessage(nodes)) {
            this.logs.push(nodes.map(Tracker.convertMessageNode))
        }
    }

    static shouldIgnoreMessage(nodes: ApMessageNode[]) {
        return nodes.some((n) => n.text.includes("'APBasicStats'"));
    }

    static convertMessageNode(node: ApMessageNode): LogNode {
        return {
            type: (node instanceof ApItemMessageNode) && node.item.progression
                ? "item-progression"
                : node.type,
            text: node.text,
            color: node instanceof ApColorMessageNode ? node?.color : undefined,
        }
    }

    sendUpdate = (slot?: string)=> {
        if (slot) {
            this.emit(`updateSlot${slot}`, this.clients[slot].getSlotData());
        }
        this.emit("updateGeneral", this.getGeneralData());
    }

    getGeneralData = (): GeneralData => {
        let slotData: {[slot: string]: GeneralSlotData} = {};
        for (let slot in this.clients) {
            const fullData = this.clients[slot].getSlotData();
            slotData[slot] = {
                game: fullData.game,
                collectedChecksCount: fullData.checkedLocations.length,
                totalChecksCount: fullData.uncheckedLocations.length + fullData.checkedLocations.length,
                deathCount: fullData.deathCount
            }
        }
        return {
            logs: this.logs,
            hints: this.hints,
            slotData: slotData,
        }

    }
    getSlotSpecificData = (slot: string) => {
        return this.clients[slot].getSlotData();
    }

    hasSlot = (slot: string) => {
        return Object.keys(this.clients).includes(slot);
    }
}



const config = await getConfig();
export const tracker = new Tracker(config);


export type GeneralData = {
    logs: LogNode[][];
    hints: Hint[];
    slotData: {[slot: string]: GeneralSlotData };
}

export type GeneralSlotData = {
    game: string,
    collectedChecksCount: number,
    totalChecksCount: number,
    deathCount: number
}

export type Hint = {
    item: string,
    location: string,
    receiver: string,
    sender: string,
    progression: boolean,
}
export type LogNode = {
    type: "item" | "item-progression" | "location" | "color" | "text" | "entrance" | "player",
    text: string,
    color?: string;
}