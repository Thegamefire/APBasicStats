<script lang="ts">
    import {onMount} from "svelte";
    import type {SlotTrackerData} from "$lib/types";
    import ReceivedItemTable from "$lib/components/ReceivedItemTable.svelte";
    import LocationTable from "$lib/components/LocationTable.svelte";
    import {source} from "sveltekit-sse";
    import type {SlotData} from "$lib/server/archipelago";
    import HintTable from "$lib/components/HintTable.svelte";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let tracker: SlotData = $state({
        game: "",
        checkedLocations: [],
        uncheckedLocations: [],
        receivedItems: [],
        deathCount: 0,
        hints: []
    });

    onMount(() => {
    const trackerSource = source(`/api/slotdata/${slotName}`).select("message");

    trackerSource.subscribe((message: string) => {
        tracker = JSON.parse(message);
    });
    })

    let tabs = $derived([
     /*{ name: "Console", comp: APConsole, props: {logs: } },*/
     { name: "Received Items", comp: ReceivedItemTable, props: {items: tracker.receivedItems}  },
     { name: "Locations", comp: LocationTable, props: {
             collectedChecks: tracker.checkedLocations,
             uncollectedChecks: tracker.uncheckedLocations
            }
        },
    { name: "Hints", comp: HintTable, props: {
            hints: tracker.hints
        }}
    ]);

    let selectedTabIndex = $state(0);
    let selectedTab = $derived(tabs[selectedTabIndex]);
</script>


<div class="flex flex-col items-center max-h-4/6">

    <div class="w-6/7 md:w-4/5 max-h-full">
        <div class="w-full mb-2">
            {#each tabs as tab, i}
                <button onclick={() => selectedTabIndex = i} class="mx-2 px-4 py-1 rounded-full {selectedTabIndex===i?'bg-violet-200':'active:bg-gray-200 hover:bg-gray-100'}">{tab.name}</button>
            {/each}
        </div>
        <div class="rounded-xl overflow-scroll max-h-full">
            <selectedTab.comp {...selectedTab.props} />
        </div>
    </div>
</div>

