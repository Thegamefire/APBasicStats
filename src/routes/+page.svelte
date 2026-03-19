<script lang="ts">
    import {onMount} from "svelte";
    import {source} from "sveltekit-sse";
    import type {GeneralData, LogNode, Hint, GeneralSlotData} from "$lib/server/tracker";
    import HintTable from "$lib/components/HintTable.svelte";
    import ConsoleTab from "$lib/components/ConsoleTab.svelte";
    import OverviewTab from "$lib/components/OverviewTab.svelte";

    let tracker: GeneralData = $state({logs: [], hints: [], slotData: {}});

    let logs: LogNode[] = $state([]);
    let hints: Hint[] = $state([]);
    let slotData: { [slot: string]: GeneralSlotData} = $state({});

    onMount(() => {
        const trackerSource = source("/api/tracker").select("message");

        trackerSource.subscribe((message: string) => {
            const msg = JSON.parse(message);
            switch (msg.cmd) {
                case "GeneralState": {
                    logs = msg.data.logs;
                    hints = msg.data.hints;
                    slotData = msg.data.slotData;
                    break;
                }
                case "LocationUpdate": {
                    if (Object.keys(slotData).includes(msg.data.slot)) {
                        slotData[msg.data.slot as string].collectedChecksCount = msg.data.collectedChecksCount
                    }
                    break;
                }
                case "Death": {
                    if (Object.keys(slotData).includes(msg.data.slot)) {
                        slotData[msg.data.slot as string].deathCount = msg.data.deathCount
                    }
                    break;
                }
                case "ConsoleMsg": {
                    logs.push(msg.data);
                    break;
                }
                case "Hint": {
                    hints.push(msg.data)
                    break;
                }
            }
        })
    })

    let tabs = $derived([
        {name: "Overview", comp: OverviewTab, props: {generalData: slotData, logs: logs}},
        {name: "Console", comp: ConsoleTab, props: {logs: logs}},
        {
            name: "Hints", comp: HintTable, props: {
                hints: hints
            }
        }
    ]);

    let selectedTabIndex = $state(0);
    let selectedTab = $derived(tabs[selectedTabIndex]);
</script>


<div class="w-full flex flex-col items-center">
    <div class="w-6/7 md:w-4/5 max-h-full">
        <div class="w-full mb-2">
            {#each tabs as tab, i}
                <button onclick={() => selectedTabIndex = i} class="mx-2 px-4 py-1 rounded-full dark:text-white {selectedTabIndex===i?'bg-violet-200 dark:bg-violet-400':'active:bg-gray-200 active:dark:bg-gray-400 hover:bg-gray-100 hover:dark:bg-gray-500'}">{tab.name}</button>
            {/each}
        </div>
        <div class="rounded-xl overflow-scroll max-h-[80vh] w-full">
            <selectedTab.comp {...selectedTab.props}/>
        </div>
    </div>
</div>