<script lang="ts">
    import TrackerTable from "$lib/components/TrackerTable.svelte";
    import {onMount} from "svelte";
    import APConsole from "$lib/components/APConsole.svelte";
    import {source} from "sveltekit-sse";
    import type {GeneralData} from "$lib/server/tracker";

    let tracker: GeneralData = $state({logs: [], hints: [], slotData: {}});

    onMount(() => {
        const trackerSource = source("/api/tracker").select("message");

        trackerSource.subscribe((message: string) => {
            tracker = JSON.parse(message);
        })
    })

    let consoleDiv: HTMLDivElement;
    const scrollToBottom = async (node: HTMLDivElement) => {
        node.scroll({top: node.scrollHeight, behavior: 'smooth'});
    };

    $effect(() => {
        tracker;
        scrollToBottom(consoleDiv)
    });
    onMount(() => scrollToBottom(consoleDiv));

    $inspect(tracker.logs)
</script>


<div class="w-full flex flex-col items-center">
    <div class="w-6/7 md:w-4/5 rounded-xl overflow-hidden mb-6">
        <TrackerTable tracker={tracker.slotData}/>
    </div>

    <div bind:this={consoleDiv}
         class="w-6/7  md:w-4/5 overflow-scroll rounded-lg  px-4 py-2 border-3  border-gray-800 dark:border-gray-100"
         style="max-height: 55vh;">
        <APConsole logs={tracker.logs}/>
    </div>
</div>