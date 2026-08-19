<script lang="ts">
    import {onMount} from "svelte";
    import {source} from "sveltekit-sse";
    import type {Item} from "$lib/server/slotmanager";
    import type {Hint} from "$lib/server/tracker";
    import ReceivedItemCard from "$lib/components/Cards/ReceivedItemCard.svelte";
    import {Button, Dropdown, DropdownItem, Heading, Hr} from "flowbite-svelte";
    import LocationCard from "$lib/components/Cards/LocationCard.svelte";
    import HintCard from "$lib/components/Cards/HintCard.svelte";
    import {horizontalScroll} from "$lib/util";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let receivedItems: Item[] = $state([]);

    let locations: { [name: string]: boolean } = $state({})
    let hints: Hint[] = $state([]);

    onMount(() => {
        const trackerSource = source(`/api/slotdata/${slotName}`).select("message");

        trackerSource.subscribe((message: string) => {
            if (!message) return;
            let msg = undefined;
            try {
                msg = JSON.parse(message);
            } finally {
                if (!msg) {
                    console.error("Failed to parse message", message);
                }
            }
            switch (msg.cmd) {
                case "Item": {
                    if (msg.data.receiver === slotName) {
                        receivedItems.push(msg.data);
                    }
                    break;
                }
                case "Hint": {
                    if ((msg.data as Hint).receiver === slotName || (msg.data as Hint).sender === slotName) {
                        hints.push(msg.data);
                    }
                    break;
                }
                case "LocationUpdate": {
                    if (msg.data.slot !== slotName) {
                        return;
                    }
                    locations[msg.data.location] = msg.data.checked;
                    break;
                }
                case "SlotState": {
                    if (msg.data.slot !== slotName) {
                        return;
                    }
                    receivedItems = msg.data.receivedItems;
                    locations = {};
                    for (const loc of msg.data.checkedLocations) {
                        locations[loc] = true;
                    }
                    for (const loc of msg.data.uncheckedLocations) {
                        locations[loc] = false;
                    }
                    hints = msg.data.hints;

                    break;
                }
            }
        });
    })

    let sortMode = $state({key: "Checked", ascending: true});

    let sortedLocations = $derived(Object.keys(locations).toSorted((a, b) => {
        switch (sortMode.key) {
            case "Name":
                return sortMode.ascending ? a.localeCompare(b) : b.localeCompare(a);
            case "Checked":
                if (locations[a] == locations[b]) {
                    // If both checked or not checked, sort on name
                    return sortMode.ascending ? a.localeCompare(b) : b.localeCompare(a);
                }
                if (sortMode.ascending) {
                    return locations[a] ? -1 : 1;
                }
                return locations[a] ? 1 : -1;
            default:
                return sortMode.ascending ? a.localeCompare(b) : b.localeCompare(a);
        }

    }));


    let itemContainer: HTMLElement | null = $state(null);
</script>

<div class="flex w-5/6 min-h-0 flex-col flex-1">
    <Heading class="w-full pb-4">{slotName}</Heading>
    <div class="flex gap-2 flex-no-wrap pb-4 overflow-x-auto no-scrollbar"
         onwheel={(evt) => horizontalScroll(evt, evt.target)} bind:this={itemContainer}>
        {#each receivedItems.toReversed() as item}
            <ReceivedItemCard {item} slot={slotName} {itemContainer}/>
        {/each}
    </div>
    <Hr class="my-2" />
    <div class="flex gap-2 min-h-0 flex-1">
        <div class="flex flex-col min-h-0 p-2 gap-2 w-4/5">
            <div class="flex justify-between mb-2 items-baseline w-full shrink-0">
                <Heading class="text-xl">Locations</Heading>
                <Button color="light">{sortMode.key} {sortMode.ascending ? "⏶" : "⏷"}</Button>
                <Dropdown simple>
                    <DropdownItem onclick={() => sortMode = {key: "Checked", ascending: true}}>Checked ⏶</DropdownItem>
                    <DropdownItem onclick={() => sortMode = {key: "Checked", ascending: false}}>Checked ⏷</DropdownItem>
                    <DropdownItem onclick={() => sortMode = {key: "Name", ascending: true}}>Name ⏶</DropdownItem>
                    <DropdownItem onclick={() => sortMode = {key: "Name", ascending: false}}>Name ⏷</DropdownItem>
                </Dropdown>
            </div>
            <div class="grid grid-cols-4 min-h-0 flex-1 overflow-y-auto no-scrollbar pb-4 gap-2">
                {#each sortedLocations as loc}
                    <LocationCard location={loc} checked={locations[loc]}/>
                {/each}
            </div>
        </div>
        <div class="bg-zinc-200 dark:bg-zinc-700 h-full my-8 mx-4 w-px shrink-0">

        </div>
        <div class="flex min-h-0 flex-1 flex-col">
            <div class="flex justify-between mb-2 items-center w-full h-15 shrink-0">
                <Heading class="text-xl">Hints</Heading>
            </div>
            <div class="flex flex-col min-h-0 flex-1 overflow-y-auto pb-4 gap-2 no-scrollbar">
                {#each hints as hint}
                    <HintCard {hint} small/>
                {/each}
            </div>
        </div>
    </div>
</div>