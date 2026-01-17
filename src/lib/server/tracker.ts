import {env} from '$env/dynamic/private';
import {Client} from "archipelago.js";
import type {Tracker} from "$lib/types";
import {building} from "$app/environment";


const tracker: Tracker = {}
const clients: { [slot: string]: Client } = {};

function connect() {
    try {
        for (let slot of JSON.parse(<string>env.AP_SLOTS)) {
            clients[slot] = new Client();

            clients[slot].room.on('locationsChecked', (e) => {
                if (tracker[slot]) {
                    tracker[slot].collectedChecksCount = clients[slot].room.checkedLocations.length;
                    sendUpdate();
                }
            });
            clients[slot].deathLink.on('deathReceived', (source) => {
                if (source == slot) {
                    tracker[slot].deathCount++;
                    sendUpdate();
                }
            })
            clients[slot].login(<string>env.AP_HOST, slot, "", {
                password: env.AP_PASSWORD,
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
        }
    } catch (e) {
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