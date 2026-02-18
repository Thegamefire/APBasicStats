<script lang="ts">
    import TrackerTable from "$lib/components/TrackerTable.svelte";
    import APConsole from "$lib/components/APConsole.svelte";

    let {tracker} = $props();

    let consoleDiv: HTMLDivElement;
    const scrollToBottom = async (node: HTMLDivElement) => {
        node.scroll({top: node.scrollHeight, behavior: 'smooth'});
    };

    $effect(() => {
        tracker;
        scrollToBottom(consoleDiv)
    });
</script>

<div class="rounded-xl overflow-hidden mb-6">
        <TrackerTable tracker={tracker.slotData}/>
    </div>

    <div bind:this={consoleDiv}
         class="overflow-scroll rounded-lg  px-4 py-2 border-3  border-gray-800 dark:border-gray-100"
         style="max-height: 50vh;">
        <APConsole logs={tracker.logs}/>
    </div>