<script lang="ts">
    import {Card, Progressbar, Span, Tooltip} from "flowbite-svelte";
    import type {Hint} from "$lib/server/tracker";
    import MapPinIcon from "$lib/components/icons/MapPinIcon.svelte";

    let {hint}: { hint: Hint } = $props();

</script>


<Card class="p-4">
    <Span highlight={hint.progression ? "lime": hint.trap ? "red" : "none"}
          class="font-bold text-xl w-fit">{hint.item}</Span>
    <Tooltip>{hint.receiver}'s Item</Tooltip>
    <span class="text-sm text-zinc-500 flex items-center gap-1 w-fit">
        <MapPinIcon/>{hint.location}</span>
    <Tooltip>{hint.sender}'s World</Tooltip>
</Card>