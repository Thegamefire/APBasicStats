<script lang="ts">
    const compareFn = (a: any, b: any) => {
        switch (sortBy.col) {
            case "Collected":
                return (collectedChecks.includes(a) === collectedChecks.includes(b)
                        ? (b.localeCompare(a))
                        : (Number(collectedChecks.includes(a)) - Number(collectedChecks.includes(b)))
                ) * (sortBy.ascending ? 1 : -1);
            default:
                return (a.localeCompare(b)) * (sortBy.ascending ? 1 : -1);
        }
    }

    let {collectedChecks, uncollectedChecks} = $props();
    let sorted = $derived(collectedChecks.concat(uncollectedChecks).toSorted(compareFn));

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
            <td>{location}</td>
            <td>{collectedChecks.includes(location) ? "✔️" : ""}</td>
        </tr>
    {/each}
    </tbody>
</table>