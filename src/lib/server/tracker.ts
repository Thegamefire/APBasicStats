import {Client, ColorMessageNode, type MessageNode} from "archipelago.js";
import type {Tracker, TrackerLogNode} from "$lib/types";
import {building} from "$app/environment";
import {getConfig, type Config} from "$lib/server/config";

let config: Config;

if (!building) {
    config = await getConfig();
}

const tracker: Tracker = {
    logs: [],
    data: {}
}
const clients: { [slot: string]: Client } = {};

function initTracker() {
    try {
        for (let aliases of config.ap_slots) {
            const slot = aliases[0]
            const client = new Client();

            client.room.on('locationsChecked', (_) => {
                if (tracker.data[slot]) {
                    tracker.data[slot].collectedChecks = client.room.checkedLocations.map((id) => client.package.lookupLocationName(client.game, id));
                    sendUpdate();
                }
            });
            client.deathLink.on('deathReceived', (source) => {
                if (aliases.includes(source)) {
                    tracker.data[slot].deathCount++;
                    sendUpdate();
                }
            })
            client.socket.on("disconnected", () => {
                console.log(`Disconnected Slot ${slot}, Trying Reconnect in 5 sec`);
                setTimeout(() => {
                    console.log(`Trying to Reconnect to Slot ${slot}`);
                    connectClient(slot);
                }, 5000);
            })

            clients[slot] = client;
            connectClient(slot)
        }
        if (config.ap_slots.length > 0) {
            const log_client = clients[config.ap_slots[0][0]];
            log_client.messages.on("message", (_, nodes) => {
                tracker.logs.push(nodes.map(serializeApMsg))
                sendUpdate();
            });
            log_client.deathLink.on("deathReceived", (source, _, cause) => {
                tracker.logs.push([
                    {type: "player", text: source},
                    {type: "color", text: " died", color: "red"},
                    {type: "text", text: cause ? ": " + cause : ""},
                ]);
                sendUpdate();
            })
        }
    } catch (e) {
        console.log(e)
        console.error("AP_SLOTS environment variable is formatted incorrectly!");
    }
}

function connectClient(slot: string) {
    const client = clients[slot];
    client.login(config.ap_host, slot, "", {
        password: config.ap_pass,
        tags: ["DeathLink", "Tracker"]
    }).then(_ => {
        console.log(`Connected to Slot ${slot}`);
        tracker.data[slot] = {
            game: clients[slot].game,
            collectedChecks: clients[slot].room.checkedLocations.map((id) => client.package.lookupLocationName(client.game, id)),
            uncollectedChecks: clients[slot].room.missingLocations.map((id) => client.package.lookupLocationName(client.game, id)),
            deathCount: 0,
        };
        sendUpdate();
    });
}

export function getTracker(): Tracker {
    return tracker;
}

const listeners = new Set<(t: Tracker) => void>();

function sendUpdate() {
    listeners.forEach((l) => l(tracker));
}

export function subscribe(fn: (t: Tracker) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

function serializeApMsg(node: MessageNode): TrackerLogNode {
    return {
        type: node.type,
        text: node.text,
        color: node instanceof ColorMessageNode ? node?.color : undefined,
    }
}

if (!building) {
    initTracker();
}