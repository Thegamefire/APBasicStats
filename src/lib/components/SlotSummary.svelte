<script lang="ts">
    import {Card, Tooltip, Progressbar} from "flowbite-svelte";
    import type {GeneralSlotData} from "$lib/server/tracker";
    import SkullIcon from "$lib/components/icons/SkullIcon.svelte";
    import GameIcon from "$lib/components/icons/GameIcon.svelte";
    import CheckIcon from "$lib/components/icons/CheckIcon.svelte";

    let {slotName, slotData}: { slotName: string, slotData: GeneralSlotData } = $props();


    let percentage = $derived(slotData.collectedChecksCount * 100 / slotData.totalChecksCount);
</script>

<Card class="md:h-36 md:min-w-64 w-fit p-4">
    <span class="font-bold text-md md:text-lg lg:text-xl">{slotName}</span>
    <span class="text-sm text-zinc-500 flex items-center gap-1 w-fit">
        <GameIcon/>{slotData.game}</span>
    <Tooltip>Game</Tooltip>
    <span class="text-sm text-zinc-500 flex items-center gap-1 w-fit">
        <CheckIcon/>{slotData.collectedChecksCount}/{slotData.totalChecksCount}
    </span>
    <Tooltip>Locations Checked</Tooltip>
    <span class="text-sm text-red-400 flex items-center gap-1 w-fit">
        <SkullIcon class="text-red-300"/>{slotData.deathCount}
    </span>
    <Tooltip>Death Count</Tooltip>
    <div class="flex items-center gap-1">
        <Progressbar progress={percentage}/>{percentage.toFixed(2)}%
    </div>
</Card>