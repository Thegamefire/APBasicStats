<script lang="ts">
    import {onMount} from "svelte";
    import {source} from "sveltekit-sse";
    import type {GeneralData, LogNode, Hint, GeneralSlotData} from "$lib/server/tracker";
    import {Hr, Button, Dropdown, DropdownItem} from "flowbite-svelte";
    import APConsole from "$lib/components/APConsole.svelte";
    import SlotSummary from "$lib/components/SlotSummary.svelte";
    import HintComponent from "$lib/components/Hint.svelte";

    let tracker: GeneralData = $state({logs: [], hints: [], slotData: {}});

    let logs: LogNode[] = $state([]);
    let hints: Hint[] = $state([]);
    let slotData: { [slot: string]: GeneralSlotData } = $state({});

    onMount(() => {
        const trackerSource = source("/api/tracker").select("message");

        const unsubscribe = trackerSource.subscribe((message: string | null) => {
            if (!message) return;
            let msg = undefined;
            try {
                msg = JSON.parse(message);
            } finally {
                if (!msg) {
                    console.error("Failed to parse message", message);
                }
            }
            console.log("Recevied message", message)

            switch (msg.cmd) {
                case "GeneralState":
                    logs = msg.data.logs.toReversed();
                    hints = msg.data.hints;
                    slotData = msg.data.slotData;
                    break;

                case "LocationUpdate": {
                    const slot = slotData[msg.data.slot];

                    if (slot) {
                        slot.collectedChecksCount = msg.data.collectedChecksCount;
                    }

                    break;
                }

                case "Death": {
                    const slot = slotData[msg.data.slot];

                    if (slot) {
                        slot.deathCount = msg.data.deathCount;
                    }

                    break;
                }

                case "ConsoleMsg":
                    logs.unshift(msg.data);
                    break;

                case "Hint":
                    hints.push(msg.data);
                    break;
            }
        });

        return () => {
            unsubscribe?.();
        };
    });

    let sortMode = $state({key: "Slot", ascending: true});

    const getPercentage = (sd: GeneralSlotData) => sd.collectedChecksCount * 100 / sd.totalChecksCount

    let sortedSlots = $derived(Object.keys(slotData).toSorted((a, b) => {
        switch (sortMode.key) {
            case "Game":
                return slotData[a].game.localeCompare(slotData[b].game) * (sortMode.ascending ? 1 : -1);
            case "Collected Checks":
                let checksComp = slotData[a].collectedChecksCount - slotData[b].collectedChecksCount
                let totalComp = slotData[a].totalChecksCount - slotData[b].totalChecksCount
                return ((checksComp != 0) ? checksComp : totalComp) * (sortMode.ascending ? 1 : -1);
            case "Percentage":
                return (getPercentage(slotData[a]) - getPercentage(slotData[b])) * (sortMode.ascending ? 1 : -1);
            case "Deaths":
                return (slotData[a].deathCount - slotData[b].deathCount) * (sortMode.ascending ? 1 : -1);
            default:
                return a.localeCompare(b) * (sortMode.ascending ? 1 : -1);
        }
    }))


</script>

<div class="flex w-5/6 min-h-0 gap-20 flex-col md:flex-row">
    <div class="flex-4 min-h-0 flex flex-col">
        <div class="flex justify-end mb-2">
            <Button color="light">{sortMode.key} {sortMode.ascending ? "⏶" : "⏷"}</Button>
            <Dropdown simple>
                <DropdownItem onclick={() => sortMode = {key: "Slot", ascending: true}}>Slot ⏶</DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Slot", ascending: false}}>Slot ⏷</DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Game", ascending: true}}>Game ⏶</DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Game", ascending: false}}>Game ⏷</DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Collected Checks", ascending: true}}>Collected Checks ⏶
                </DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Collected Checks", ascending: false}}>Collected Checks ⏷
                </DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Percentage", ascending: true}}>Percentage ⏶
                </DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Percentage", ascending: false}}>Percentage ⏷
                </DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Deaths", ascending: true}}>Deaths ⏶</DropdownItem>
                <DropdownItem onclick={() => sortMode = {key: "Deaths", ascending: false}}>Deaths ⏷</DropdownItem>
            </Dropdown>
        </div>
        <div class="flex flex-wrap gap-2 min-h-0">
            {#each sortedSlots as slot}
                <SlotSummary slotName={slot} slotData={slotData[slot]}/>
            {/each}
        </div>
        <Hr class="m-8"/>
        <div class=" flex-1 overflow-scroll min-h-0 grid grid-cols-2 xl:grid-cols-4 gap-2 pb-4 no-scrollbar">
            {#each hints as hint (hint.location)}
                <HintComponent {hint}/>
            {/each}
        </div>
    </div>
    <div class="overflow-scroll flex flex-col flex-1 min-h-0 pb-4 no-scrollbar">
        <APConsole {logs}/>
    </div>
</div>