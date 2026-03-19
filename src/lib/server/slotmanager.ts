import {
    Client,
    type GetPacket,
    Hint as ApHint,
    Item as ApItem,
    type RetrievedPacket,
    type SetPacket
} from "archipelago.js";
import {type Config, getConfig} from "$lib/server/config";
import {building} from "$app/environment";
import EventEmitter from "node:events";
import {type Hint, Tracker} from "$lib/server/tracker"
import {GoodSet} from "$lib/goodset";
let config: Config;

if (!building) {
    config = await getConfig();
}

export class SlotManager extends EventEmitter{
    public readonly slot: string;
    private readonly aliases: string[];
    public items: GoodSet<Item>;
    public hints: GoodSet<Hint>;
    public client: Client;

    private deathCount: number;
    constructor(aliases: string[], mainSlot?: boolean) {
        super();
        this.aliases = aliases;
        this.slot = aliases[0];
        this.deathCount = 0;
        this.items = new GoodSet<Item>();
        this.hints = new GoodSet<Hint>();
        this.client = new Client();

        this.client.socket.on("connected", this.onConnected);
        this.client.socket.on("disconnected", this.onDisconnect);
        this.client.deathLink.on("deathReceived", this.onDeath);
        this.client.room.on('locationsChecked', this.onLocationsChecked);
        this.client.items.on("itemsReceived", this.onItemsReceived);
        this.client.items.on("hintReceived", this.onHint);
        this.client.items.on("hintsInitialized", (l) => this.onHint(...l));
        this.client.socket.on("retrieved", this.onRetrieved);

    }

    connect = () => {
        if (this.client.socket.connected) {
            return;
        }

        this.client.login(
            config.ap_host,
            this.slot,
            "",
            {
                password: config.ap_pass,
                tags: ["DeathLink", "APBasicStats", "Tracker"]
            }
        )
            .catch(() => {
                console.error(`[AP] Failed to Connect to ${this.slot}\n     Retrying in 5sec...`);
                setTimeout(() => this.connect(), 5000);
            });
    }

    onConnected = () => {
        console.log(`[AP] Connected to Slot ${this.slot}`);
        this.fetchDeathCount();
        this.emit("SlotState", this.getSlotState());
    }

    onDisconnect = () => {
        console.log(`[AP] Disconnected from Slot ${this.slot}\n     Reconnecting...`);
        this.connect();
    }

    onLocationsChecked = (locations: number[])=> {
        for (const id of locations) {
            const location = this.locationIdToName(id);
            this.emit("LocationUpdate", {slot: this.slot, location: location, checked: true})
        }
    }

    onItemsReceived = (items: ApItem[]) => {
        for (const apItem of items) {
            const item = SlotManager.convertApItem(apItem);
            this.items.add(item);
            this.emit("Item", {
                item: item.name,
                location: item.location,
                sender: item.sender,
                receiver: this.slot,
                collectedCheckCount: this.getLocationsList(true).length
            });
        }
    }

    onHint = (...hints: ApHint[]) => {
        for (const apHint of hints) {
            if (!this.isOwnHint(apHint)) {
                continue;
            }
            const hint = Tracker.convertHint(apHint);
            this.hints.add(hint);
            this.emit("Hint", hint);
        }
    }

    onDeath = (source: string, time: number, cause?: string | undefined) => {
        if (this.aliases.includes(source)) {
            this.deathCount++;
            this.emit("Death", {slot: this.slot, deathCount: this.deathCount});
            this.saveDeathCount();
        }
    }

    onRetrieved = (packet: RetrievedPacket) => {
        if (`${this.slot}_deathcount` in packet.keys) {
            const deathCount: number | null = packet.keys[`${this.slot}_deathcount`] as number | null;
            if (deathCount != null) {
                const oldDeathCount = this.deathCount;
                this.deathCount = deathCount;
                if (oldDeathCount !== this.deathCount) {
                    this.emit("Death", {slot: this.slot, deathCount: this.deathCount});
                }
            }
        }
    }

    isOwnHint = (hint: ApHint) => {
        return hint.item.receiver.name === this.slot || hint.item.sender.name === this.slot;
    }
    static convertApItem(item: ApItem): Item {
        return {
            sender: item.sender.name,
            name: item.name,
            location: item.locationName,
            progression: item.progression,
        }
    }

    locationIdToName = (location: number) => {
        return this.client.package.lookupLocationName(this.client.game, location)
    }

    saveDeathCount = () => {
        const deathSavePacket: SetPacket = {
            cmd: "Set",
            default: 0,
            key: `${this.slot}_deathcount`,
            operations: [
                {
                    operation: "replace",
                    value: this.deathCount,
                }
            ],
            want_reply: false,
        };
        this.client.socket.send(deathSavePacket);
    }

    fetchDeathCount = () => {
        const deathLoadPacket: GetPacket = {
            cmd: "Get",
            keys: [`${this.slot}_deathcount`]
        };
        this.client.socket.send(deathLoadPacket);
    }

    getLocationsList = (checked: boolean) => {
        if (checked) {
            return Array.from(new Set(this.client.room.checkedLocations.map(this.locationIdToName)));
        } else {
            return Array.from(new Set(this.client.room.missingLocations.map(this.locationIdToName)));
        }
    }

    getSlotState= (): SlotState => {
        return {
            slot: this.slot,
            receivedItems: this.items.items(),
            checkedLocations: this.getLocationsList(true),
            uncheckedLocations: this.getLocationsList(false),
            deathCount: this.deathCount,
            game: this.client.game,
            hints: this.hints.items()
        }
    }
}

export type SlotState = {
    slot: string,
    receivedItems: Item[];
    checkedLocations: string[];
    uncheckedLocations: string[];
    deathCount: number;
    game: string;
    hints: Hint[]
}

export type Item = {
    sender: string;
    name: string;
    location: string;
    progression: boolean;
}