import {Client, Item as ApItem} from "archipelago.js";
import {type Config, getConfig} from "$lib/server/config";
import {building} from "$app/environment";
import EventEmitter from "node:events";
let config: Config;

if (!building) {
    config = await getConfig();
}

export class ClientManager extends EventEmitter{
    public readonly slot: string;
    private readonly aliases: string[]
    public client: Client;

    private deathCount: number;
    constructor(aliases: string[], mainSlot?: boolean) {
        super();
        this.aliases = aliases;
        this.slot = aliases[0];
        this.deathCount = 0;
        this.client = new Client();

        this.client.socket.on("connected", this.onConnected);
        this.client.socket.on("disconnected", this.onDisconnect);
        this.client.deathLink.on("deathReceived", this.onDeath);
        this.client.room.on('locationsChecked', this.sendUpdate);
        this.client.items.on("itemsReceived", this.sendUpdate);

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
    }

    onDisconnect = () => {
        console.log(`[AP] Disconnected from Slot ${this.slot}\n     Reconnecting...`);
        this.connect();
    }

    onDeath = (source: string, time: number, cause?: string | undefined) => {
        if (this.aliases.includes(source)) {
            this.deathCount++;
            this.sendUpdate();
        }
    }

    sendUpdate = () => {
        this.emit("update");
    }

    getSlotData = (): SlotData => {
        return {
            receivedItems: this.client.items.received.map(ClientManager.convertApItem),
            checkedLocations: this.client.room.checkedLocations.map(this.locationIdToName),
            uncheckedLocations: this.client.room.missingLocations.map(this.locationIdToName),
            deathCount: this.deathCount,
            game: this.client.game,
        }
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
}

export type SlotData = {
    receivedItems: Item[];
    checkedLocations: string[];
    uncheckedLocations: string[];
    deathCount: number;
    game: string;
}

export type Item = {
    sender: string;
    name: string;
    location: string;
    progression: boolean;
}