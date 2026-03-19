import {EventEmitter} from "node:events";
import {type Config, getConfig} from "$lib/server/config";
import {SlotManager} from "$lib/server/slotmanager";
import {
    ColorMessageNode as ApColorMessageNode,
    type Hint as ApHint,
    ItemMessageNode as ApItemMessageNode,
    type MessageNode as ApMessageNode
} from "archipelago.js"
import {building} from "$app/environment";
import {GoodSet} from "$lib/goodset";

export class Tracker extends EventEmitter {
    private config: Config;
    readonly clients: { [slot: string]: SlotManager };

    private readonly logs: LogNode[][];
    private readonly mainClient: SlotManager;

    constructor(config: Config) {
        super();
        this.config = config;
        this.logs = [];
        this.clients = {};

        for (let slot of this.config.ap_slots) {
            const client = new SlotManager(slot)
            this.clients[slot[0]] = client;
            client.on("Death", e => this.emit("Death", e));
            client.on("Item", e => this.emit("Item", e));
            client.on("LocationUpdate", e => this.emit("LocationUpdate", e));
            client.on("SlotState", e => this.emit("SlotConnect", e));
            client.on("Hint", e => {
                if ((e as Hint).receiver === slot[0]) {
                    this.emit("Item", e)
                }
            });
            client.connect();
        }
        this.mainClient = this.clients[this.config.ap_slots[0][0]];
        this.mainClient.client.messages.on("message", this.onMessage);
        this.mainClient.client.deathLink.on("deathReceived", this.logDeath);
    }

    onMessage = (text: string, nodes: ApMessageNode[]) => {
        if (!Tracker.shouldIgnoreMessage(nodes)) {
            const message = nodes.map(Tracker.convertMessageNode);
            this.logs.push(message);
            this.emit("ConsoleMsg", message);
        }
    }

    logDeath = (source: string, time: number, cause?: string | undefined) => {
        const msg: LogNode[] = [
            {type: "player", text: source},
            {type: "color", text: " died", color: "red"},
            {type: "text", text: cause ? ": " + cause : ""},
        ]
        this.logs.push(msg);
        this.emit("ConsoleMsg", msg);
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

    static convertHint(hint: ApHint): Hint {
        return {
            item: hint.item.name,
            location: hint.item.locationName,
            receiver: hint.item.receiver.name,
            sender: hint.item.sender.name,
            progression: hint.item.progression,
            trap: hint.item.trap,
        }
    }

    getGeneralState = (): GeneralData => {
        let slotData: { [slot: string]: GeneralSlotData } = {};
        for (let slot in this.clients) {
            const fullData = this.clients[slot].getSlotState();
            slotData[slot] = {
                game: fullData.game,
                collectedChecksCount: fullData.checkedLocations.length,
                totalChecksCount: fullData.uncheckedLocations.length + fullData.checkedLocations.length,
                deathCount: fullData.deathCount
            }
        }
        return {
            logs: this.logs,
            hints: GoodSet.union<Hint>(...Object.values(this.clients).map(s => s.hints)).items(),
            slotData: slotData,
        }

    }
    getSlotSpecificData = (slot: string) => {
        return this.clients[slot].getSlotState();
    }

    hasSlot = (slot: string) => {
        return Object.keys(this.clients).includes(slot);
    }

    getDataPackage() {
        return this.mainClient.client.package.exportPackage();
    }
}

export let tracker: Tracker;
if (!building) {
    const config = await getConfig();
    tracker = new Tracker(config);
}

export type GeneralData = {
    logs: LogNode[][];
    hints: Hint[];
    slotData: { [slot: string]: GeneralSlotData };
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
    trap: boolean,
}
export type LogNode = {
    type: "item" | "item-progression" | "item-trap" | "location" | "color" | "text" | "entrance" | "player",
    text: string,
    color?: string;
}