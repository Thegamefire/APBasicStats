<script lang="ts">
    import TrackerTable from "$lib/components/TrackerTable.svelte";
    import {onMount} from "svelte";
    import type {GeneralTrackerData, Tracker} from '$lib/types';
    import APConsole from "$lib/components/APConsole.svelte";

    let tracker: GeneralTrackerData = $state({logs: [], data: {}});

    onMount(() => {
        const source = new EventSource('/api/tracker');

        source.onmessage = (event) => {
            tracker = JSON.parse(event.data);
        };
        return () => source.close();
    });

    let consoleDiv: HTMLDivElement;
    const scrollToBottom = async (node: HTMLDivElement) => {
        node.scroll({top: node.scrollHeight, behavior: 'smooth'});
    };

    $effect(() => {
        tracker;
        scrollToBottom(consoleDiv)
    });
    onMount(() => scrollToBottom(consoleDiv));
</script>


<div class="w-full flex flex-col items-center">
    <div class="w-6/7 md:w-4/5 rounded-xl overflow-hidden mb-6">
        <TrackerTable tracker={tracker.data}/>
    </div>

    <div bind:this={consoleDiv}
         class="w-6/7  md:w-4/5 overflow-scroll rounded-lg  px-4 py-2 border-3  border-gray-800 dark:border-gray-100"
         style="max-height: 55vh;">
        <APConsole logs={tracker.logs}/>
    </div>
</div>