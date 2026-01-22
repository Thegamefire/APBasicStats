export type TrackedSlotData = {
    game: string,
    collectedChecksCount: number,
    totalChecksCount: number,
    deathCount: number
}

export type TrackerLogNode = {
    type: "item" | "location" | "color" | "text" | "entrance" | "player",
    text: string,
    color?: string;
}

export type Tracker = { logs: TrackerLogNode[][], data: {[slot: string]: TrackedSlotData} }