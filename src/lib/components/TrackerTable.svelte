<script lang="ts">
    let {tracker} = $props();

    let sortBy = $state({col: "Slot", ascending: false})

    function headerClicked(col: string) {
        if (sortBy.col == col) {
            sortBy.ascending = !sortBy.ascending;
        } else {
            sortBy.col = col;
            sortBy.ascending = false;
        }
        console.log(sortBy)
    }

    let slots = $derived(Object.keys(tracker).toSorted((a, b) => {
        switch (sortBy.col) {
            case "Game":
                return tracker[a].game.localeCompare(tracker[b].game) * (sortBy.ascending ? 1 : -1);
            case "Collected Checks":
                let checksComp = tracker[a].collectedChecksCount - tracker[b].collectedChecksCount
                let totalComp = tracker[a].totalChecksCount - tracker[b].totalChecksCount
                return ((checksComp != 0) ? checksComp : totalComp) * (sortBy.ascending ? 1 : -1);
            case "Completion Percentage":
                return (getPercentage(a) - getPercentage(b)) * (sortBy.ascending ? 1 : -1);
            case "Death Count":
                return (tracker[a].deathCount - tracker[b].deathCount) * (sortBy.ascending ? 1 : -1);
            default:
                return a.localeCompare(b) * (sortBy.ascending ? 1 : -1);
        }
    }))

    function getPercentage(slot: string) {
        return tracker[slot].collectedChecksCount * 100 / tracker[slot].totalChecksCount;
    }

    function getSortIcon(header: string) {
        if (header == sortBy.col) {
            return sortBy.ascending ? '▲' : '▼';
        }
        return " ";
    }
</script>

<table class="w-full md:text-lg lg:text-xl text-center">
    <thead>
    <tr>
        {#each ["Slot", "Game", "Collected Checks", "Completion Percentage", "Death Count"] as header}
            <th class="py-2 cursor-pointer bg-violet-200 dark:bg-violet-600 dark:text-white"
                onclick={() => headerClicked(header)}>{header} {getSortIcon(header)}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each slots as slot}
        <tr class=" bg-violet-100 dark:bg-violet-500 dark:text-white">
            <td class="py-1 pb-2">{slot}</td>
            <td>{tracker[slot].game}</td>
            <td>{tracker[slot].collectedChecksCount}/{tracker[slot].totalChecksCount}</td>
            <td>{getPercentage(slot)}%</td>
            <td>{tracker[slot].deathCount}</td>
        </tr>
    {/each}
    </tbody>
</table>