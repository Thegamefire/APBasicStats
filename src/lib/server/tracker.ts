import {EventEmitter} from "node:events";
import {type Config, getConfig} from "$lib/server/config";
import {ClientManager} from "$lib/server/archipelago";
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
    private readonly clients: { [slot: string]: ClientManager };

    private readonly hints: GoodSet<Hint>;
    private readonly logs: LogNode[][];
    private readonly mainClient: ClientManager;

    constructor(config: Config) {
        super();
        this.config = config;
        this.logs = [];
        this.clients = {};
        this.hints = new GoodSet<Hint>();

        for (let slot of this.config.ap_slots) {
            const client = new ClientManager(slot)
            this.clients[slot[0]] = client;
            client.client.items.on("hintReceived", this.onHint)
            client.client.items.on("hintsInitialized", (hints) => this.onHint(...hints))
            client.on("update", () => this.sendUpdate(slot[0]))
            client.connect();
        }
        this.mainClient = this.clients[this.config.ap_slots[0][0]];
        this.mainClient.client.messages.on("message", this.onMessage);
        this.mainClient.client.deathLink.on("deathReceived", this.logDeath);
    }

    onHint = (...hints: ApHint[]) => {
        let internal_hints = hints.map(Tracker.convertHint);
        this.hints.add(...internal_hints);
    }

    onMessage = (text: string, nodes: ApMessageNode[]) => {
        if (!Tracker.shouldIgnoreMessage(nodes)) {
            this.logs.push(nodes.map(Tracker.convertMessageNode))
        }
    }

    logDeath = (source: string, time: number, cause?: string | undefined) => {
        this.logs.push([
            {type: "player", text: source},
            {type: "color", text: " died", color: "red"},
            {type: "text", text: cause ? ": " + cause : ""},
        ]);
        this.sendUpdate();
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

    sendUpdate = (slot?: string) => {
        if (slot) {
            this.emit(`updateSlot${slot}`, this.clients[slot].getSlotData());
        }
        this.emit("updateGeneral", this.getGeneralData());
    }

    getGeneralData = (): GeneralData => {
        let slotData: { [slot: string]: GeneralSlotData } = {};
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
            hints: this.hints.items(),
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