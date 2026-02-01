export type TrackedSlotData = {
    game: string,
    collectedChecks: string[],
    uncollectedChecks: string[],
    receivedItems: PublicItem[],
    deathCount: number
}

export type TrackerLogNode = {
    type: "item" | "location" | "color" | "text" | "entrance" | "player",
    text: string,
    color?: string;
}

export type Tracker = { logs: TrackerLogNode[][], data: { [slot: string]: TrackedSlotData } }

export type GeneralTrackerData = {
    logs: TrackerLogNode[][],
    data: {
        [slot: string]: {
            game: string,
            collectedChecksCount: number,
            totalChecksCount: number,
            deathCount: number
        }
    }
}

export type SlotTrackerData = {
    logs: TrackerLogNode[][]
    data: TrackedSlotData
}

export type PublicItem = {
    sender: string,
    name: string,
    location: string,
}