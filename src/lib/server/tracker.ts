import { config } from '$lib/server/config';
import {Client} from "archipelago.js";
import type {Tracker} from "$lib/types";
import {building} from "$app/environment";


const tracker: Tracker = {}
const clients: { [slot: string]: Client } = {};

function connect() {
    try {
        for (let aliases of config.ap_slots) {
            const slot = aliases[0]
            const client = new Client();

            client.room.on('locationsChecked', (e) => {
                if (tracker[slot]) {
                    tracker[slot].collectedChecksCount = client.room.checkedLocations.length;
                    sendUpdate();
                }
            });
            client.deathLink.on('deathReceived', (source) => {
                if (aliases.includes(source)) {
                    tracker[slot].deathCount++;
                    sendUpdate();
                }
            })
            client.login(config.ap_host, slot, "", {
                password: config.ap_pass,
                tags: ["DeathLink", "Tracker", "NoText"]
            }).then(r => {
                console.log(`Connected to Slot ${slot}`);
                tracker[slot] = {
                    game: clients[slot].game,
                    collectedChecksCount: clients[slot].room.checkedLocations.length,
                    totalChecksCount: clients[slot].room.missingLocations.length + clients[slot].room.checkedLocations.length,
                    deathCount: 0,
                };
                sendUpdate();
            });
            clients[slot] = client;
        }
    } catch (e) {
        console.log(e)
        console.error("AP_SLOTS environment variable is formatted incorrectly!");
    }
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

if (!building) {
    connect();
}