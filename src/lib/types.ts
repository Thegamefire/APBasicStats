export type TrackedSlotData = {
    game: string,
    collectedChecksCount: number,
    totalChecksCount: number,
    deathCount: number
}
export type Tracker = { [slot: string]: TrackedSlotData }

