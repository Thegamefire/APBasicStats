<script lang="ts">
    import {onMount} from "svelte";
    import ReceivedItemTable from "$lib/components/ReceivedItemTable.svelte";
    import LocationTable from "$lib/components/LocationTable.svelte";
    import {source} from "sveltekit-sse";
    import type {SlotData} from "$lib/server/archipelago";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let tracker: SlotData = $state({
        game: "",
        checkedLocations: [],
        uncheckedLocations: [],
        receivedItems: [],
        deathCount: 0
    });

    onMount(() => {
        const trackerSource = source(`/api/slotdata/${slotName}`).select("message");

        trackerSource.subscribe((message: string) => {
            tracker = JSON.parse(message);
        });
    })

    $inspect(tracker);
</script>
<div class="w-full flex flex-col items-center max-h-4/5">
    <div class="w-6/7 md:w-4/5 rounded-xl mb-6 max-h-2/5 overflow-scroll">
        <ReceivedItemTable items={tracker.receivedItems}/>
    </div>
    <div class="w-6/7 md:w-4/5 rounded-xl max-h-4/6 overflow-scroll mb-6">
        <LocationTable collectedChecks={tracker.checkedLocations}
                       uncollectedChecks={tracker.uncheckedLocations}/>
    </div>
</div>