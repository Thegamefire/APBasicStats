<script lang="ts">
    import type {TrackerLogNode} from "$lib/types";

    let { node }: {node:TrackerLogNode} = $props();
</script>

{#if node.type === "item"}
    <span class="text-green-500 dark:text-green-300">{node.text}</span>
{:else if node.type === "item-progression"}
        <span class="text-green-700 dark:text-green-500">{node.text}</span>
{:else if node.type === "item-trap"}
    <span class="text-red-500 dark:text-red-300">{node.text}</span>
{:else if node.type === "player"}
    <span class="text-purple-500 dark:text-purple-300">{node.text}</span>
{:else if node.type === "location"}
    <span class="text-orange-400 dark:text-orange-300">{node.text}</span>
{:else if node.type === "color"}
    <span style="color: {node.color}">{node.text}</span>
{:else}
    <span class="text-black dark:text-white">{node.text}</span>
{/if}