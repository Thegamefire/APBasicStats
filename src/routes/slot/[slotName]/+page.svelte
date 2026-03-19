<script lang="ts">
    import {onMount} from "svelte";
    import ReceivedItemTable from "$lib/components/ReceivedItemTable.svelte";
    import LocationTable from "$lib/components/LocationTable.svelte";
    import {source} from "sveltekit-sse";
    import type {Item} from "$lib/server/slotmanager";
    import type {Hint} from "$lib/server/tracker";
    import HintTable from "$lib/components/HintTable.svelte";

    let {data} = $props()
    const slotName = $derived(data.slotName);

    let receivedItems: Item[] = $state([]);
    let checkedLocations: string[] = $state([]);
    let uncheckedLocations: string[] = $state([]);
    let hints: Hint[] = $state([]);

    onMount(() => {
    const trackerSource = source(`/api/slotdata/${slotName}`).select("message");

    trackerSource.subscribe((message: string) => {
        const msg = JSON.parse(message);
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
                if (msg.data.checked) {
                    uncheckedLocations = uncheckedLocations.filter(l => msg.data.location !== l);
                    checkedLocations.push(msg.data.location as string);
                } else {
                    checkedLocations = checkedLocations.filter(l => msg.data.location !== l);
                    uncheckedLocations.push(msg.data.location as string);
                }
                break;
            }
            case "SlotState": {
                if (msg.data.slot !== slotName) {
                    return;
                }
                receivedItems = msg.data.receivedItems;
                checkedLocations = msg.data.checkedLocations;
                uncheckedLocations = msg.data.uncheckedLocations;
                hints = msg.data.hints;

                break;
            }
        }
    });
    })


    let tabs = $derived([
     { name: "Received Items", comp: ReceivedItemTable, props: {items: receivedItems}  },
     { name: "Locations", comp: LocationTable, props: {
             collectedChecks: checkedLocations,
             uncollectedChecks: uncheckedLocations
            }
        },
    { name: "Hints", comp: HintTable, props: {
            hints: hints
        }}
    ]);

    let selectedTabIndex = $state(0);
    let selectedTab = $derived(tabs[selectedTabIndex]);
</script>


<div class="flex flex-col items-center max-h-4/6">

    <div class="w-6/7 md:w-4/5 max-h-full">
        <div class="w-full mb-2">
            {#each tabs as tab, i}
                <button onclick={() => selectedTabIndex = i} class="mx-2 px-4 py-1 rounded-full  dark:text-white {selectedTabIndex===i?'bg-violet-200 dark:bg-violet-400':'active:bg-gray-200 active:dark:bg-gray-400 hover:bg-gray-100 hover:dark:bg-gray-500'}">{tab.name}</button>
            {/each}
        </div>
        <div class="rounded-xl overflow-scroll max-h-full">
            <selectedTab.comp {...selectedTab.props} />
        </div>
    </div>
</div>

