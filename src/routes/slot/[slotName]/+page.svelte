<script lang="ts">
    import {onMount} from "svelte";
    import type {SlotTrackerData} from "$lib/types";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let tracker: SlotTrackerData = $state({
        logs: [],
        data: {game: "", collectedChecks: [], uncollectedChecks: [], deathCount: 0}
    });

    onMount(() => {
        const source = new EventSource(`/api/slotdata/${slotName}`);

        source.onmessage = (event) => {
            tracker = JSON.parse(event.data);
        };
        return () => source.close();
    });
</script>