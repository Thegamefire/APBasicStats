<script lang="ts">
    import {Card, Span, Tooltip} from "flowbite-svelte";
    import type {Hint} from "$lib/server/tracker";
    import MapPinIcon from "$lib/components/icons/MapPinIcon.svelte";

    let {hint, small = false}: { hint: Hint, small?: boolean } = $props();

</script>


<Card class="p-4">
    <Span highlight={hint.progression ? "lime": hint.trap ? "red" : "none"}
          class="{small?" font-semibold text-lg":"font-bold text-xl"} w-fit {!(hint.progression || hint.trap) ? "dark:text-white": ""}">{hint.item}</Span>
    <Tooltip>{hint.receiver}'s Item</Tooltip>
    <span class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 w-fit">
        <MapPinIcon/>{hint.location}</span>
    <Tooltip>{hint.sender}'s World</Tooltip>
</Card>