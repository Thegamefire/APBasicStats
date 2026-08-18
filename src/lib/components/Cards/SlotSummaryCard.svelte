<script lang="ts">
    import {Card, Tooltip, Progressbar} from "flowbite-svelte";
    import type {GeneralSlotData} from "$lib/server/tracker.ts";
    import SkullIcon from "$lib/components/icons/SkullIcon.svelte";
    import GameIcon from "$lib/components/icons/GameIcon.svelte";
    import CheckIcon from "$lib/components/icons/CheckIcon.svelte";

    let {slotName, slotData}: { slotName: string, slotData: GeneralSlotData } = $props();


    let percentage = $derived(slotData.collectedChecksCount * 100 / slotData.totalChecksCount);
</script>

<Card class="md:h-36 md:min-w-64 w-fit p-4 dark:bg-zinc-800">
    <a href="/slot/{slotName}"
       class="font-bold dark:text-white text-md md:text-lg lg:text-xl hover:underline">{slotName}</a>
    <span class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 w-fit">
        <GameIcon/>{slotData.game}</span>
    <Tooltip class="dark:bg-zinc-900">Game</Tooltip>
    <span class="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 w-fit">
        <CheckIcon/>{slotData.collectedChecksCount}/{slotData.totalChecksCount}
    </span>
    <Tooltip class="dark:bg-zinc-900">Locations Checked</Tooltip>
    <span class="text-sm text-red-400 flex items-center gap-1 w-fit">
        <SkullIcon class="text-red-300"/>{slotData.deathCount}
    </span>
    <Tooltip class="dark:bg-zinc-900">Death Count</Tooltip>
    <div class="flex items-center gap-1 dark:text-white">
        <Progressbar class="dark:bg-zinc-700" progress={percentage}/>{percentage.toFixed(2)}%
    </div>
</Card>