<script lang="ts">
    import APConsole from "$lib/components/APConsole.svelte";

    let {logs} = $props()

    let consoleDiv: HTMLDivElement;
    const scrollToBottom = async (node: HTMLDivElement) => {
        node.scroll({top: node.scrollHeight, behavior: 'smooth'});
    };

    $effect(() => {
        logs;
        scrollToBottom(consoleDiv)
    });
</script>

<div bind:this={consoleDiv}
     class="w-6/7  md:w-4/5 overflow-scroll rounded-lg  px-4 py-2 border-3  border-gray-800 dark:border-gray-100"
        style="max-height: 75vh;">
    <APConsole logs={logs}/>
</div>