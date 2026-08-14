<script lang="ts">
    import {onMount} from "svelte";
    import {source} from "sveltekit-sse";
    import type {GeneralData, LogNode, Hint, GeneralSlotData} from "$lib/server/tracker";
    import HintTable from "$lib/components/HintTable.svelte";
    import ConsoleTab from "$lib/components/ConsoleTab.svelte";
    import OverviewTab from "$lib/components/OverviewTab.svelte";
    import {Tabs, TabItem} from "flowbite-svelte";

    let tracker: GeneralData = $state({logs: [], hints: [], slotData: {}});

    let logs: LogNode[] = $state([]);
    let hints: Hint[] = $state([]);
    let slotData: { [slot: string]: GeneralSlotData } = $state({});

    onMount(() => {
        const trackerSource = source("/api/tracker").select("message");

        const unsubscribe = trackerSource.subscribe((message: string | null) => {
            if (!message) return;
            const msg = JSON.parse(message);

            switch (msg.cmd) {
                case "GeneralState":
                    logs = msg.data.logs;
                    hints = msg.data.hints;
                    slotData = msg.data.slotData;
                    break;

                case "LocationUpdate": {
                    const slot = slotData[msg.data.slot];

                    if (slot) {
                        slot.collectedChecksCount = msg.data.collectedChecksCount;
                    }

                    break;
                }

                case "Death": {
                    const slot = slotData[msg.data.slot];

                    if (slot) {
                        slot.deathCount = msg.data.deathCount;
                    }

                    break;
                }

                case "ConsoleMsg":
                    logs = [...logs, msg.data];
                    break;

                case "Hint":
                    hints = [...hints, msg.data];
                    break;
            }
        });

        return () => {
            unsubscribe?.();
        };
    });
</script>


<Tabs tabStyle="pill" contentClass="lg:w-5/6">
    <TabItem open title="Overview">
        <OverviewTab generalData={slotData} {logs}/>
    </TabItem>
    <TabItem title="Console">
        <ConsoleTab {logs}/>
    </TabItem>
    <TabItem title="Hints">
        <div class="rounded-lg overflow-hidden">
            <HintTable {hints}/>
        </div>
    </TabItem>
</Tabs>