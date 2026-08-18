<script lang="ts">
    import {Card, Span} from "flowbite-svelte";
    import CheckIcon from "$lib/components/icons/CheckIcon.svelte";

    let {location, checked}: { location: string, checked: boolean } = $props();
</script>

<Card class="p-2 flex flex-row items-center justify-between">
    <span>{location}</span>
    {#if checked}
        <Span highlight="lime" class="text-lg"><CheckIcon/></Span>
    {/if}
</Card>