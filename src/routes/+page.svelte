<script lang="ts">
    import {onMount} from "svelte";
    import {source} from "sveltekit-sse";
    import type {GeneralData} from "$lib/server/tracker";
    import HintTable from "$lib/components/HintTable.svelte";
    import ConsoleTab from "$lib/components/ConsoleTab.svelte";
    import OverviewTab from "$lib/components/OverviewTab.svelte";

    let tracker: GeneralData = $state({logs: [], hints: [], slotData: {}});

    onMount(() => {
        const trackerSource = source("/api/tracker").select("message");

        trackerSource.subscribe((message: string) => {
            tracker = JSON.parse(message);
        })
    })

    let tabs = $derived([
        { name: "Overview", comp: OverviewTab, props: {tracker: tracker}  },
        { name: "Console", comp: ConsoleTab, props: { logs: tracker.logs}},
        { name: "Hints", comp: HintTable, props: {
                hints: tracker.hints
            }}
    ]);

    let selectedTabIndex = $state(0);
    let selectedTab = $derived(tabs[selectedTabIndex]);
</script>


<div class="w-full flex flex-col items-center">
    <div class="w-6/7 md:w-4/5 max-h-full">
        <div class="w-full mb-2">
            {#each tabs as tab, i}
                <button onclick={() => selectedTabIndex = i} class="mx-2 px-4 py-1 rounded-full {selectedTabIndex===i?'bg-violet-200':'active:bg-gray-200 hover:bg-gray-100'}">{tab.name}</button>
            {/each}
        </div>
        <div class="rounded-xl overflow-scroll max-h-full w-full">
            <selectedTab.comp {...selectedTab.props} />
        </div>
    </div>
</div>