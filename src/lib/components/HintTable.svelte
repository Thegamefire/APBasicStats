<script lang="ts">
    let {hints} = $props();
    let sortBy = $state({col: "Reciever", ascending: false})
  
    function headerClicked(col: string) {
        if (sortBy.col == col) {
            sortBy.ascending = !sortBy.ascending;
        } else {
            sortBy.col = col;
            sortBy.ascending = false;
        }
    }

  let recievers = $derived(hints.toSorted((a, b) => {
        switch (sortBy.col) {
            case "Reciever":
                return a.reciever.localeCompare(b.reciever) * (sortBy.ascending ? 1 : -1);
            case "Name":
                return a.name.localeCompare(b.name) * (sortBy.ascending ? 1 : -1);
            case "Location":
                return a.location.localeCompare(b.location) * (sortBy.ascending ? 1 : -1);
            case "Sender":
                return a.sender.localeCompare(b.sender) * (sortBy.ascending ? 1 : -1);
            default:
                return a.localeCompare(b) * (sortBy.ascending ? 1 : -1);
        }
    }))

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
        {#each ["Reciever", "Name", "Sender", "Location"] as header}
            <th class="py-2 cursor-pointer bg-violet-200 dark:bg-violet-600 dark:text-white"
                onclick={() => headerClicked(header)}>{header} {getSortIcon(header)}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each recievers as reciever, i}
        <tr class=" {i%2===1? 'bg-violet-100 dark:bg-violet-500':'bg-violet-200/60 dark:bg-violet-500/95'}  dark:text-white">
            <td>{reciever.reciever}</td>
            <td>{reciever.name}</td>
            <td>{reciever.sender}</td>
            <td>{reciever.location}</td>
        </tr>
    {/each}
    </tbody>
</table>
