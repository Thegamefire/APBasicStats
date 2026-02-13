<script lang="ts">
    const compareFn = (a: any, b: any) => {
        switch (sortBy.col) {
            case "Collected":
                return (a.collected === b.collected
                        ? (b.location.localeCompare(a.location))
                        : (Number(a.collected) - Number(b.collected))
                ) * (sortBy.ascending ? 1 : -1);
            default:
                return (a.location.localeCompare(b.location)) * (sortBy.ascending ? 1 : -1);
        }
    }

    let {collectedChecks, uncollectedChecks} = $props();
    let fullList = $derived(collectedChecks.map((loc:string) => {return {location: loc, collected: true}}).concat(uncollectedChecks.map((loc:string) => {return {location: loc, collected: false}})))
    let sorted = $derived(fullList.toSorted(compareFn));

    let sortBy = $state({col: "Collected", ascending: false})

    function headerClicked(col: string) {
        if (sortBy.col == col) {
            sortBy.ascending = !sortBy.ascending;
        } else {
            sortBy.col = col;
            sortBy.ascending = false;
        }
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
        {#each ["Location", "Collected"] as header}
            <th class="py-2 cursor-pointer bg-violet-200 dark:bg-violet-600 dark:text-white"
                onclick={() => headerClicked(header)}>{header} {getSortIcon(header)}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each sorted as location, i}
        <tr class=" {i%2===1? 'bg-violet-100 dark:bg-violet-500':'bg-violet-200/60 dark:bg-violet-500/95'}  dark:text-white">
            <td>{location.location}</td>
            <td>{location.collected ? "✔️" : ""}</td>
        </tr>
    {/each}
    </tbody>
</table>