<script lang="ts">
    import {onMount} from "svelte";
    import type {SlotTrackerData} from "$lib/types";
    import ReceivedItemTable from "$lib/components/ReceivedItemTable.svelte";
    import LocationTable from "$lib/components/LocationTable.svelte";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let tracker: SlotTrackerData = $state({
        logs: [],
        data: {game: "", collectedChecks: [], uncollectedChecks: [], receivedItems: [], deathCount: 0}
    });

    onMount(() => {
        const source = new EventSource(`/api/slotdata/${slotName}`);

        source.onmessage = (event) => {
            tracker = JSON.parse(event.data);
        };
        return () => source.close();
    });

    $inspect(tracker);
</script>
<div class="w-full flex flex-col items-center max-h-4/5">
    <div class="w-6/7 md:w-4/5 rounded-xl mb-6 max-h-2/5 overflow-scroll">
        <ReceivedItemTable items={tracker.data.receivedItems}/>
    </div>
    <div class="w-6/7 md:w-4/5 rounded-xl max-h-4/6 overflow-scroll mb-6">
        <LocationTable collectedChecks={tracker.data.collectedChecks}
                       uncollectedChecks={tracker.data.uncollectedChecks}/>
    </div>
</div>