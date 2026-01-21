<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import TrackerTable from "$lib/components/TrackerTable.svelte";
    import {onMount} from "svelte";
    import type {Tracker} from '$lib/types';

    let tracker: Tracker = $state({});

    onMount(() => {
        const source = new EventSource('/api/tracker');

        source.onmessage = (event) => {
            tracker = JSON.parse(event.data);
        };
        return () => source.close();
    });
</script>


<div class="w-full flex flex-col items-center">
    <div class="w-4/5 rounded-xl overflow-hidden">
        <TrackerTable {tracker}/>
    </div>
</div>