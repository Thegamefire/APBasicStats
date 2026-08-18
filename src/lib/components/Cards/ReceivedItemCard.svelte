<script lang="ts">
    import {Card, Span, Tooltip} from "flowbite-svelte";
    import MapPinIcon from "$lib/components/icons/MapPinIcon.svelte";
    import PersonIcon from "$lib/components/icons/PersonIcon.svelte";
    import type {Item} from "$lib/server/slotmanager";

    let {item, slot}: { item: Item, slot: string } = $props();

</script>


<Card class="p-4 w-fit">
    <Span highlight={item.progression ? "lime" : "none"}
          class="font-bold text-xl w-fit pr-3 {!item.progression ? "dark:text-white": ""}">{item.name}</Span>
    <Tooltip>{slot}'s Item</Tooltip>
    <span class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 w-fit wrap">
        <MapPinIcon/>{item.location}</span>
    <Tooltip>{item.sender}'s World</Tooltip>
    <span class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 w-fit">
        <PersonIcon/>{item.sender}</span>
</Card>