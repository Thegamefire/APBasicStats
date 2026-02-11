<script lang="ts">
    import {onMount} from "svelte";
    import type {SlotTrackerData} from "$lib/types";
    import {source} from "sveltekit-sse";
    import ReceivedItemTable from "$lib/components/ReceivedItemTable.svelte";
    import LocationTable from "$lib/components/LocationTable.svelte";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let tracker: SlotTrackerData = $state({
    logs: [],
    data: {game: "", collectedChecks: [], uncollectedChecks: [], receivedItems: [], deathCount: 0}
    });

    onMount(() => {
    const trackerSource = source(`/api/slotdata/${slotName}`).select("message");

    trackerSource.subscribe((message: string) => {
        tracker = JSON.parse(message);
    });
    })

    let tabs = $derived([
     /*{ name: "Console", comp: APConsole, props: {logs: } },*/
     { name: "Received Items", comp: ReceivedItemTable, props: {items: tracker.data.receivedItems}  },
     { name: "Locations", comp: LocationTable, props: {
             collectedChecks: tracker.data.collectedChecks,
             uncollectedChecks: tracker.data.uncollectedChecks
         }  },
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

