<script lang="ts">
    const compareFn = (a: any, b: any) => {
        switch (sortBy.col) {
            case "Received Item":
                return a.name.localeCompare(b.name) * (sortBy.ascending ? 1 : -1);
            case "Sender":
                return a.sender.localeCompare(b.sender) * (sortBy.ascending ? 1 : -1);
            case "Location":
                return a.location.localeCompare(b.location) * (sortBy.ascending ? 1 : -1);
            default:
                return (a.orderReceived - b.orderReceived) * (sortBy.ascending ? 1 : -1);
        }
    }

    let {items} = $props();
    let sorted = $derived(items.map((item: any, i: number) => {
        return {name: item.name, sender: item.sender, location: item.location, orderReceived: items.length - i}
    }).toSorted(compareFn));

    let sortBy = $state({col: "Order Received", ascending: false})

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
    <tr class="sticky">
        {#each ["Received Item", "Sender", "Location", "Order Received"] as header}
            <th class="py-2 cursor-pointer bg-violet-200 dark:bg-violet-600 dark:text-white"
                onclick={() => headerClicked(header)}>{header} {getSortIcon(header)}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each sorted as item, i}
        <tr class=" {i%2===1? 'bg-violet-100 dark:bg-violet-500':'bg-violet-200/60 dark:bg-violet-500/95'}  dark:text-white">
            <td>{item.name}</td>
            <td>{item.sender}</td>
            <td>{item.location}</td>
            <td>{item.orderReceived}</td>
        </tr>
    {/each}
    </tbody>
</table>